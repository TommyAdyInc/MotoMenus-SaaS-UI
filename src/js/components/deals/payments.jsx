import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import Loading from "../../helpers/Loading.jsx";

class DealPayment extends React.Component {
  state = {
    months: [],
    schedule: {
      show_accessories_payment_on_pdf: "",
      rate: this.props.interest,
      payment_options: {
        down_payment_options: [0, 0, 0],
        months: []
      }
    },
    payments: {},
    amount: 0,
    unit: 0,
    loading: false
  };

  constructor(props) {
    super(props);

    this.timeout = null;
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentDidMount() {
    const { ui, api } = this.props;

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/settings/payment-months",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => this.setState({ months: data }, this.calculate))
      .catch(errors => console.log(errors));

    let schedule = this.props.schedule
      ? this.props.schedule
      : {
          show_accessories_payment_on_pdf: "",
          rate: this.props.interest,
          payment_options: {
            down_payment_options: [0, 0, 0],
            months: []
          }
        };

    let amount = this.props.units.length
      ? this.props.units[0].cash_balance || 0
      : 0;

    this.setState({ schedule, amount });
  }

  setRate(value) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      schedule.rate = value;

      return { schedule };
    }, this.scheduleUpdated);
  }

  setOnPdf(checked) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      schedule.show_accessories_payment_on_pdf = checked;

      return { schedule };
    }, this.scheduleUpdated);
  }

  setDownPayment(index, value) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      let payment_options = { ...schedule.payment_options };
      let down_payment_options = [...payment_options.down_payment_options];

      down_payment_options[index] = value;
      payment_options.down_payment_options = down_payment_options;
      schedule.payment_options = payment_options;

      return { schedule };
    }, this.scheduleUpdated);
  }

  monthSelected(month) {
    return this.state.schedule.payment_options.months.indexOf(month) > -1;
  }

  setMonths(bool, value) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      let payment_options = { ...schedule.payment_options };
      let months = [...payment_options.months];

      if (bool) {
        months.push(value);
      } else {
        let i = months.indexOf(value);

        if (i > -1) {
          months.splice(i, 1);
        }
      }

      payment_options.months = months;
      schedule.payment_options = payment_options;

      return { schedule };
    }, this.scheduleUpdated);
  }

  allTotal() {
    return this.props.units.reduce((total, u) => {
      total += parseFloat(u.cash_balance);

      return total;
    }, 0);
  }

  calculate() {
    let amount =
      this.state.unit === "all"
        ? this.allTotal()
        : this.props.units[this.state.unit].cash_balance || 0;

    let payments = {};
    let periodic_interest = parseFloat(this.state.schedule.rate) / 12 / 100; // rate is annual rate
    let that = this;
    this.state.months.forEach(function(month) {
      let discount_factor =
        (Math.pow(1 + periodic_interest, month) * periodic_interest) /
        (Math.pow(1 + periodic_interest, month) - 1);

      let monthly = {};

      that.state.schedule.payment_options.down_payment_options.forEach(function(
        d
      ) {
        monthly[d] = (parseFloat(amount) - d) * discount_factor;
      });

      payments[month] = monthly;
    });

    this.setState({ payments });
  }

  calculateServer() {
    const { ui, api } = this.props;

    let amount =
      this.state.unit === "all"
        ? this.allTotal()
        : this.props.units[this.state.unit].cash_balance || 0;

    if (this.state.schedule.rate) {
      this.setState({ loading: true });
      axios({
        method: "POST",
        url: apiURL(api, ui) + "/calculate-payments",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        },
        data: {
          down_payments: this.state.schedule.payment_options
            .down_payment_options,
          rate: this.state.schedule.rate,
          amount: amount
        }
      })
        .then(({ data }) => this.setState({ payments: data }))
        .catch(errors => console.log(errors))
        .finally(() => this.setState({ loading: false }));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let that = this;
    let changed = !prevProps.units && this.props.units;

    if (!changed && prevProps.units) {
      changed = prevProps.units.reduce((bool, u, index) => {
        if (
          u.cash_balance !== that.props.units[index].cash_balance &&
          index === parseInt(that.state.unit)
        ) {
          bool = true;
        }

        return bool;
      }, false);
    }

    if (!changed && prevProps.schedule) {
      changed =
        parseFloat(prevProps.schedule.rate) !==
        parseFloat(this.state.schedule.rate);
    }

    if (changed) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.calculate(), 1000);
    }
  }

  scheduleUpdated() {
    this.props.scheduleUpdated(this.state.schedule);
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 mr-1 w-1/2 border border-blue-500 rounded-lg p-3">
        {this.state.loading && <Loading />}
        <div className="block w-full text-lg mb-2">
          Payment Schedule{" "}
          {this.props.units.length > 1 && (
            <div className="inline-block float-right">
              <select
                className="form-select py-1"
                onChange={e =>
                  this.setState({ unit: e.target.value }, this.calculate)
                }
              >
                {this.props.units.map(function(u, index) {
                  return (
                    <option key={index} value={index}>
                      Unit {index + 1}
                    </option>
                  );
                })}
                <option value="all">All Units</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2">Rate: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.schedule.rate}
            onChange={e => this.setRate(e.target.value)}
            className="form-input mr-5 w-1/5"
          />
          <input
            type="checkbox"
            defaultChecked={this.state.schedule.show_accessories_payment_on_pdf}
            onChange={e => this.setOnPdf(e.target.checked)}
            className="form-checkbox mr-2"
          />
          <span className="inline-block">Show accessories on payments PDF</span>
        </div>
        <table className="w-full table mt-3">
          <tbody>
            <tr>
              <td className="w-1/4 text-center">
                $
                {this.props.units.length
                  ? (this.state.unit === "all"
                      ? this.allTotal()
                      : parseFloat(
                          this.props.units[this.state.unit].cash_balance
                        ) || 0
                    ).toFixed(2)
                  : "0.00"}
              </td>
              <td className="w-1/4">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={
                    this.state.schedule.payment_options
                      .down_payment_options[0] || ""
                  }
                  onChange={e => this.setDownPayment(0, e.target.value)}
                  onBlur={() => this.calculate()}
                  className="form-input w-full"
                />
              </td>
              <td className="w-1/4">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={
                    this.state.schedule.payment_options
                      .down_payment_options[1] || ""
                  }
                  onChange={e => this.setDownPayment(1, e.target.value)}
                  onBlur={() => this.calculate()}
                  className="form-input w-full"
                />
              </td>
              <td className="w-1/4">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={
                    this.state.schedule.payment_options
                      .down_payment_options[2] || ""
                  }
                  onChange={e => this.setDownPayment(2, e.target.value)}
                  onBlur={() => this.calculate()}
                  className="form-input w-full"
                />
              </td>
            </tr>
            {this.state.months.map((m, index) => {
              return (
                <tr key={index}>
                  <td
                    className={
                      this.monthSelected(m) ? "font-bold" : "font-normal"
                    }
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      defaultChecked={this.monthSelected(m)}
                      onChange={e => this.setMonths(e.target.checked, m)}
                    />{" "}
                    {m} months
                  </td>
                  <td
                    className={
                      this.monthSelected(m) ? "font-bold" : "font-normal"
                    }
                  >
                    $
                    {(
                      (!!this.state.payments[m] &&
                        this.state.payments[m][
                          this.state.schedule.payment_options
                            .down_payment_options[0]
                        ]) ||
                      0
                    ).toFixed(2)}
                  </td>
                  <td
                    className={
                      this.monthSelected(m) ? "font-bold" : "font-normal"
                    }
                  >
                    $
                    {(
                      (!!this.state.payments[m] &&
                        this.state.payments[m][
                          this.state.schedule.payment_options
                            .down_payment_options[1]
                        ]) ||
                      0
                    ).toFixed(2)}
                  </td>
                  <td
                    className={
                      this.monthSelected(m) ? "font-bold" : "font-normal"
                    }
                  >
                    $
                    {(
                      (!!this.state.payments[m] &&
                        this.state.payments[m][
                          this.state.schedule.payment_options
                            .down_payment_options[2]
                        ]) ||
                      0
                    ).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </label>
    );
  }
}

export default DealPayment;
