import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";

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
  };

  constructor(props) {
    super(props);
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
      .then(({ data }) => this.setState({ months: data }))
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

    let amount = this.props.units[0].cash_balance || 0;

    this.setState({ schedule, amount });
  }

  setRate(value) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      schedule.rate = value;

      return { schedule };
    }, this.calculate);
  }

  setOnPdf(checked) {
    this.setState(state => {
      let schedule = { ...state.schedule };
      schedule.show_accessories_payment_on_pdf = checked;

      return { schedule };
    }, this.calculate);
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
    });
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
    }, this.calculate);
  }

  calculate() {
    const { ui, api } = this.props;

    axios({
      method: "POST",
      url: apiURL(api, ui) + "/calculate-payments",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        down_payments: this.state.schedule.payment_options.down_payment_options,
        rate: this.state.schedule.rate,
        amount: this.state.amount
      }
    })
      .then(({ data }) => this.setState({ payments: data }))
      .catch(errors => console.log(errors));
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-1/2 border border-blue-500 rounded-lg p-3">
        <span className="block w-full text-lg mb-2">Payment Schedule</span>
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
              <td className="w-1/4">&nbsp;</td>
              <td className="w-1/4">
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={this.state.schedule.payment_options.down_payment_options[0] || ''}
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
                  value={this.state.schedule.payment_options.down_payment_options[1] || ''}
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
                  value={this.state.schedule.payment_options.down_payment_options[2] || ''}
                  onChange={e => this.setDownPayment(2, e.target.value)}
                  onBlur={() => this.calculate()}
                  className="form-input w-full"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </label>
    );
  }
}

export default DealPayment;
