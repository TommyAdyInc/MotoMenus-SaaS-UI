import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken
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
    save_success: false
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
          sales_status: "",
          customer_type: ""
        }
      });
    } else {
      this.setState({ deal: this.props.deal });
    }
  }

  saveDeal() {
    this.checkSession();

    const { api, ui, deal } = this.props;

    this.setState({ loading: true });

    let data = {};
    for (let key in this.state.deal) {
      if (!this.state.deal.hasOwnProperty(key)) continue;

      data[key] = this.state.deal[key];
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

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    const { ui, api } = this.props;

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
            <div className="w-full flex flex-wrap flex-grow flex-row justify-start p-5">
              <Customer ui={ui} api={api} customer={this.state.deal.customer} />
              <Unit ui={ui} api={api} units={this.state.deal.units} />
              <Trade ui={ui} api={api} trades={this.state.deal.trades} />
              <Status ui={ui} api={api} deal={this.state.deal} />
              <Accessories
                ui={ui}
                api={api}
                accessories={this.state.deal.accessories}
              />
              <Purchase ui={ui} api={api} units={this.state.deal.units} />
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
