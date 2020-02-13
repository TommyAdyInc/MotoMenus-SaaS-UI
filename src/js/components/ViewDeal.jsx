import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken,
  isAdmin,
  authUser
} from "../helpers/auth";
import { apiURL } from "../helpers/url";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";
import Customer from "./deals/customer.jsx";
import Unit from "./deals/units.jsx";
import Trade from "./deals/trades.jsx";
import Status from "./deals/status.jsx";
import Accessories from "./deals/accessories.jsx";
import Purchase from "./deals/purchase.jsx";
import Payment from "./deals/payments.jsx";
import Finance from "./deals/finance.jsx";

class ViewDeal extends React.Component {
  state = {
    deal: null,
    loading: false,
    error: null,
    save_success: false,
    user_id: null
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.deal) {
      this.setState({
        deal: {
          customer: {},
          units: [],
          trades: [],
          finance_insurance: {},
          purchase_schedule: {},
          accessories: [],
          sales_status: "Greeting",
          customer_type: [],
          deal_date: new Date().toLocaleDateString()
        }
      });
    } else {
      this.setState({ deal: this.props.deal });
    }

    this.setState({ user_id: authUser().id });
  }

  setStatus(status) {
    this.setDeal("sales_status", status);
  }

  setDeal(field, value) {
    this.setState(state => {
      let deal = { ...state.deal };

      deal[field] = value;

      return { deal };
    });
  }

  saveDeal() {
    this.checkSession();

    const { api, ui, deal } = this.props;

    this.setState({ loading: true });

    let data = {};
    for (let key in this.state.deal) {
      if (!this.state.deal.hasOwnProperty(key)) continue;

      data[key] = this.state.deal[key];

      if (key === "units") {
        data[key] = this.checkValidUnits(data[key]);
      }
    }

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/deal/" + deal.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: data
    })
      .then(() => {
        this.setState({
          save_success: true
        });
        setTimeout(() => this.setState({ update_success: false }), 4000);
      })
      .catch(errors => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>
                  We were unable to save the deal.{" "}
                  {errors.error ||
                    Object.values(errors.response.data.errors).join(", ")}
                </div>
              </span>
              <button
                className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full"
                onClick={() => this.setState({ error: null })}
              >
                Close
              </button>
            </div>
          </Modal>
        );

        this.setState({ error });
      })
      .finally(() => this.setState({ loading: false }));
  }

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  checkValidUnits(units) {
    return units
      .filter(u => {
        return (
          u.stock_number ||
          u.year ||
          u.make ||
          u.model ||
          u.model_number ||
          u.color ||
          u.odometer
        );
      })
      .map(u => {
        u.purchase_information =
          !u.purchase_information.price && !u.purchase_information.price
            ? null
            : u.purchase_information;

        return u;
      });
  }

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    const { ui, api, steps, types, users } = this.props;

    let consultants = [];
    users.forEach(function(u, i) {
      consultants.push(
        <option value={u.id} key={i}>
          {u.name}
        </option>
      );
    });

    return (
      <div className="py-10 w-full">
        {this.state.loading && <Loading />}
        {this.state.save_success && (
          <div className="w-full p-5 mb-5 bg-green-200 text-green-700 text-md rounded-lg">
            <b>Success.</b> Deal has been saved.
          </div>
        )}
        {this.state.deal && (
          <div className="mb-5 rounded-lg border-blue-500 border p-0">
            <h2 className="px-5 py-2 bg-blue-500 text-white">
              {this.props.deal ? "Edit" : "New"} deal
            </h2>
            <Status
              ui={ui}
              api={api}
              deal={this.state.deal}
              steps={steps}
              types={types}
              setStatus={status => this.setStatus(status)}
            />
            <div className="w-full flex flex-row p-5">
              <Customer ui={ui} api={api} customer={this.state.deal.customer} />

              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/4 pr-3">
                <span className="block w-full">Customer Type</span>
                <select
                  className="form-select w-full"
                  multiple={true}
                  size={types.length}
                  value={this.state.deal.customer_type}
                  onChange={e =>
                    this.setDeal(
                      "customer_type",
                      Array.from(e.target.selectedOptions, item => item.value)
                    )
                  }
                >
                  {types.map((ct, index) => {
                    return (
                      <option value={ct} key={index}>
                        {ct}
                      </option>
                    );
                  })}
                </select>
                <span className="text-xs">Ctrl+Click to select multiple</span>
              </label>

              <label
                className="block text-gray-700 text-sm font-bold mb-2 w-1/4 pr-3"
                htmlFor="consultant"
              >
                <span className="block w-full mb-5">
                  Date of Deal: {this.state.deal.deal_date}
                </span>
                {isAdmin() && consultants.length > 1 && (
                  <div className="w-full">
                    <span className="block w-full">Sales Consultant</span>
                    <select
                      className="form-select py-1 w-full"
                      value={this.state.user_id}
                      onChange={event =>
                        this.setState({ user_id: event.target.value })
                      }
                      name="consultant"
                    >
                      {consultants}
                    </select>
                  </div>
                )}
              </label>
            </div>
            <div className="w-full flex flex-row p-5">
              <Unit
                ui={ui}
                api={api}
                units={this.state.deal.units}
                unitUpdated={units => this.setDeal("units", units)}
              />
            </div>
            <div className="w-full flex flex-row p-5">
              <Trade ui={ui} api={api} trades={this.state.deal.trades} />
              <Accessories
                ui={ui}
                api={api}
                accessories={this.state.deal.accessories}
              />
            </div>
            <div className="w-full flex flex-row p-5">
              <Payment
                ui={ui}
                api={api}
                payments={this.state.deal.payment_schedule}
              />
              <Finance
                ui={ui}
                api={api}
                finance={this.state.deal.finance_insurance}
              />
            </div>
            <div className="w-full text-right p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
                onClick={() => this.saveDeal()}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {this.state.error}
      </div>
    );
  }
}

export default ViewDeal;
