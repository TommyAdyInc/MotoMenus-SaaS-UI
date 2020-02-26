import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealFinance extends React.Component {
  state = {
    finance: this.newFinance()
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let finance = this.props.finance ? this.setNullValues() : this.newFinance();

    this.setState({ finance });
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

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 ml-1 w-1/2 border border-blue-500 rounded-lg p-3">
        <span className="block w-full text-lg mb-2">Finance & Insurance</span>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Cash Down Payment: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.cash_down_payment}
            onChange={e => this.setFinance(e.target.value, "cash_down_payment")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Cash Down Payment"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Preferred & Std Rate:{" "}
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.preferred_standard_rate}
            onChange={e =>
              this.setFinance(e.target.value, "preferred_standard_rate")
            }
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Preferred & Std Rate"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Preferred & Std Term:{" "}
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.preferred_standard_term}
            onChange={e =>
              this.setFinance(e.target.value, "preferred_standard_term")
            }
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Preferred & Std Term"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Promotional Rate: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.promotional_rate}
            onChange={e => this.setFinance(e.target.value, "promotional_rate")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Promotional Rate"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Promotional Term: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.promotional_term}
            onChange={e => this.setFinance(e.target.value, "promotional_term")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Promotional Rate"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Full Protection: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.full_protection}
            onChange={e => this.setFinance(e.target.value, "full_protection")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Full Protection"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Limited Protection: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.limited_protection}
            onChange={e =>
              this.setFinance(e.target.value, "limited_protection")
            }
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Limited Protection"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Tire / Wheel: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.tire_wheel}
            onChange={e => this.setFinance(e.target.value, "tire_wheel")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Tire / Wheel"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Gap Coverage: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.gap_coverage}
            onChange={e => this.setFinance(e.target.value, "gap_coverage")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Gap Coverage"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">Theft: </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.theft}
            onChange={e => this.setFinance(e.target.value, "theft")}
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Theft"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Priority Maintenance:{" "}
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.priority_maintenance}
            onChange={e =>
              this.setFinance(e.target.value, "priority_maintenance")
            }
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Priority Maintenance"
          />
        </div>
        <div className="flex flex-row w-full">
          <span className="inline-block mr-2 w-1/2">
            Appearance Protection:{" "}
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={this.state.finance.appearance_protection}
            onChange={e =>
              this.setFinance(e.target.value, "appearance_protection")
            }
            className="form-input w-1/2 py-1 mb-1"
            placeholder="Appearance Protection"
          />
        </div>
      </label>
    );
  }
}

export default DealFinance;
