import React from "react";
import axios from "axios";
import Loading from "../../helpers/Loading.jsx";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { downloadPdf } from "../../helpers/download";

class DealFinance extends React.Component {
  state = {
    finance: this.newFinance(),
    units: [],
    trades: [],
    loading: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let finance = this.props.finance ? this.setNullValues() : this.newFinance();
    let units = this.props.units.reduce((carry, u) => {
      if (u.id) {
        carry.push(u.id);
      }

      return carry;
    }, []);
    let trades = this.props.trades.reduce((carry, t) => {
      if (t.id) {
        carry.push(t.id);
      }

      return carry;
    }, []);
    this.setState({ finance, units, trades });
  }

  setNullValues() {
    for (let key in this.props.finance) {
      if (!this.props.finance.hasOwnProperty(key)) continue;

      if (this.props.finance[key] === null) {
        this.props.finance[key] = "";
      }
    }

    return this.props.finance;
  }

  newFinance() {
    return {
      cash_down_payment: "",
      preferred_standard_rate: "",
      preferred_standard_term: "",
      promotional_rate: "",
      promotional_term: "",
      full_protection: "",
      limited_protection: "",
      tire_wheel: "",
      gap_coverage: "",
      theft: "",
      priority_maintenance: "",
      appearance_protection: ""
    };
  }

  setFinance(value, field) {
    this.setState(state => {
      let finance = { ...state.finance };

      finance[field] = value;

      return { finance };
    }, this.financeUpdated);
  }

  financeUpdated() {
    this.props.financeUpdated(this.state.finance);
  }

  downloadFinancePdf() {
    if (this.props.finance && parseInt(this.props.finance.deal_id)) {
      const { api, ui } = this.props;

      this.setState({ loading: true });

      axios({
        method: "GET",
        url: apiURL(api, ui) + "/pdf/" + this.props.finance.deal_id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        },
        params: {
          type: "finance",
          unit: this.state.units,
          trade: this.state.trades
        }
      })
        .then(({ data }) =>
          downloadPdf(
            data,
            "Finance-Insurance-" +
              this.props.customer.first_name +
              " " +
              this.props.customer.last_name +
              ".pdf"
          )
        )
        .catch(error => console.log(error))
        .finally(() => this.setState({ loading: false }));
    }
  }

  pdfCashSpecials() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/pdf/cash-special",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => downloadPdf(data, "CashSpecials.pdf"))
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  emailToCustomer() {
    //
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1 w-1/2 border border-blue-500 rounded-lg p-3">
        {this.state.loading && <Loading />}
        <span className="block w-full text-lg mb-2">Finance & Insurance</span>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Cash Down Payment: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.cash_down_payment}
              onChange={e =>
                this.setFinance(e.target.value, "cash_down_payment")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Cash Down Payment"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Preferred & Std Rate:{" "}
          </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.preferred_standard_rate}
              onChange={e =>
                this.setFinance(e.target.value, "preferred_standard_rate")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Preferred & Std Rate"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Preferred & Std Term:{" "}
          </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={18}
              step={1}
              value={this.state.finance.preferred_standard_term}
              onChange={e =>
                this.setFinance(e.target.value, "preferred_standard_term")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Preferred & Std Term"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Promotional Rate: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.promotional_rate}
              onChange={e =>
                this.setFinance(e.target.value, "promotional_rate")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Promotional Rate"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Promotional Term: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={18}
              step={1}
              value={this.state.finance.promotional_term}
              onChange={e =>
                this.setFinance(e.target.value, "promotional_term")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Promotional Term"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Full Protection: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.full_protection}
              onChange={e => this.setFinance(e.target.value, "full_protection")}
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Full Protection"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Limited Protection: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.limited_protection}
              onChange={e =>
                this.setFinance(e.target.value, "limited_protection")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Limited Protection"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Tire / Wheel: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.tire_wheel}
              onChange={e => this.setFinance(e.target.value, "tire_wheel")}
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Tire / Wheel"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Gap Coverage: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.gap_coverage}
              onChange={e => this.setFinance(e.target.value, "gap_coverage")}
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Gap Coverage"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Theft: </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.theft}
              onChange={e => this.setFinance(e.target.value, "theft")}
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Theft"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Priority Maintenance:{" "}
          </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.priority_maintenance}
              onChange={e =>
                this.setFinance(e.target.value, "priority_maintenance")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Priority Maintenance"
            />
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Appearance Protection:{" "}
          </span>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm sm:leading-5">$</span>
            </div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={this.state.finance.appearance_protection}
              onChange={e =>
                this.setFinance(e.target.value, "appearance_protection")
              }
              className="form-input block w-full pl-7  sm:text-sm sm:leading-5 w-1/2 py-1"
              placeholder="Appearance Protection"
            />
          </div>
        </div>
        {this.props.finance &&
          this.props.finance.deal_id &&
          this.props.units.length > 0 && (
            <div className="w-full text-right mt-3">
              <button
                className="bg-pink-600 text-white rounded-full px-4 text-sm py-1 mr-2 hover:bg-pink-900"
                onClick={() => this.downloadFinancePdf()}
              >
                PDF
              </button>
              <button
                className="bg-pink-600 text-white rounded-full px-4 text-sm py-1 mr-2 hover:bg-pink-900"
                onClick={() => this.emailToCustomer()}
              >
                Email
              </button>
              <button
                className="bg-pink-600 text-white rounded-full px-4 text-sm py-1 hover:bg-pink-900"
                onClick={() => this.pdfCashSpecials()}
              >
                Cash Specials
              </button>
            </div>
          )}
      </label>
    );
  }
}

export default DealFinance;
