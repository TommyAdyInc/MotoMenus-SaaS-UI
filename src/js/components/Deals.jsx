import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  isAdminAuthenticated,
  getAdminAuthToken,
  sessionExpired,
  logout,
  getAuthToken,
  isAdmin
} from "../helpers/auth";
import { apiURL } from "../helpers/url";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";
import Paging from "../helpers/Paging.jsx";
import ViewDeal from "./ViewDeal.jsx";

class Deals extends React.Component {
  state = {
    deals: [],
    sales_steps: [],
    customer_types: [],
    loading: false,
    error: null,
    paging: null,
    view_deal: false,
    confirm_delete: null,
    show_filter: false,
    users: [],
    user_id: 0,
    customer: {
      first_name: "",
      middle_name: "",
      last_name: "",
      phone: ""
    },
    unit: {
      model: "",
      model_number: "",
      make: ""
    },
    trade: {
      model: "",
      model_number: "",
      make: ""
    },
    sales_status: "all",
    customer_type: [],
    edit_deal: null,
    tax_rate: 0,
    document_fee: 0,
    interest: 0
  };

  constructor(props) {
    super(props);
  }

  getDeals(paging = null) {
    this.checkSession();

    const { api, ui } = this.props;

    this.setState({ loading: true });

    let params = {};

    if (paging === "next") {
      params.page = parseInt(this.state.paging.current_page) + 1;
    }

    if (paging === "prev") {
      params.page = parseInt(this.state.paging.current_page) - 1;
    }

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/deal",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken() || getAdminAuthToken()
      },
      params: this.setFilter(params)
    })
      .then(({ data }) => {
        let deals = [...data.data];
        delete data.data;
        let paging = data;

        this.setState({ deals, paging });
      })
      .catch(() => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>Could not retrieve deals.</div>
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

  getSalesSteps() {
    const { api, ui } = this.props;
    axios({
      method: "GET",
      url: apiURL(api, ui) + "/deal/sales-steps",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => this.setState({ sales_steps: data }))
      .catch(errors => console.log(errors));
  }

  getCustomerTypes() {
    const { api, ui } = this.props;
    axios({
      method: "GET",
      url: apiURL(api, ui) + "/deal/customer-types",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => this.setState({ customer_types: data }))
      .catch(errors => console.log(errors));
  }

  getTaxRate() {
    const { api, ui } = this.props;
    axios({
      method: "GET",
      url: apiURL(api, ui) + "/settings",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => {
        this.setState({
          tax_rate: data.default_tax_rate,
          interest: data.default_interest_rate
        });
      })
      .catch(errors => console.log(errors));
  }

  getDocumentFee() {
    const { api, ui } = this.props;
    axios({
      method: "GET",
      url: apiURL(api, ui) + "/settings/document-fee",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => this.setState({ document_fee: data["document_fee"] }))
      .catch(errors => console.log(errors));
  }

  setFilter(params) {
    if (parseInt(this.state.user_id)) {
      params.user_id = this.state.user_id;
    }

    if (
      !!this.state.customer.first_name ||
      !!this.state.customer.middle_name ||
      !!this.state.customer.last_name ||
      !!this.state.customer.phone
    ) {
      params.customer = this.state.customer;
    }

    if (
      !!this.state.unit.model ||
      !!this.state.unit.model_number ||
      !!this.state.unit.make ||
      !!this.state.unit.stock_number
    ) {
      params.unit = this.state.unit;
    }

    if (
      !!this.state.trade.model ||
      !!this.state.trade.model_number ||
      !!this.state.trade.make
    ) {
      params.trade = this.state.trade;
    }

    if (this.state.sales_status) {
      params.sales_status = this.state.sales_status;
    }

    if (this.state.customer_type.length) {
      params.customer_type = this.state.customer_type;
    }

    return params;
  }

  resetFilter() {
    this.setState(
      {
        user_id: 0,
        customer: {
          first_name: "",
          middle_name: "",
          last_name: "",
          phone: ""
        },
        unit: {
          stock_number: "",
          model: "",
          model_number: "",
          make: ""
        },
        trade: {
          model: "",
          model_number: "",
          make: ""
        },
        sales_status: "all",
        customer_type: []
      },
      this.getDeals
    );
  }

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  newDealFromEdit() {
    this.setState(
      {
        view_deal: false
      },
      this.newDeal
    );
  }

  newDeal() {
    this.setState({
      view_deal: true,
      edit_deal: null
    });
  }

  editDeal(deal) {
    this.setState({
      view_deal: true,
      edit_deal: deal
    });
  }

  deleteDeal(deal) {
    let confirm_delete = (
      <Modal>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirm Delete
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-500">
                    Are you sure you want to completely remove the selected deal
                    for {deal.customer.first_name} {deal.customer.last_name}?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
            <button
              className="text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded-md"
              onClick={() => this.confirmDelete(deal)}
            >
              Confirm
            </button>
            <button
              className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-md mr-6"
              onClick={() => this.setState({ confirm_delete: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );

    this.setState({ confirm_delete });
  }

  confirmDelete(deal) {
    this.setState({ confirm_delete: null, loading: true });
    const { api, ui } = this.props;
    axios({
      method: "DELETE",
      url: apiURL(api, ui) + "/deal/" + deal.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(() =>
        this.setState({ view_deal: false, edit_deal: null }, this.getDeals)
      )
      .catch(errors => console.log(errors))
      .finally(() => this.setState({ loading: false }));
  }

  getUsers() {
    this.checkSession();

    const { api, ui } = this.props;

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/users",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      params: {
        filter: "all",
        no_paging: true
      }
    })
      .then(({ data }) => {
        let users = data;
        this.setState({ users });
      })
      .catch(errors => console.log(errors));
  }

  componentDidMount() {
    if (isAuthenticated() || isAdminAuthenticated()) {
      this.getSalesSteps();
      this.getCustomerTypes();
      this.getTaxRate();
      this.getDocumentFee();
      this.getDeals();

      if (isAdmin()) {
        this.getUsers();
      }
    }
  }

  setCustomer(value, field) {
    this.setState(state => {
      let customer = { ...state.customer };
      customer[field] = value;

      return { customer };
    });
  }

  setUnit(value, field) {
    this.setState(state => {
      let unit = { ...state.unit };
      unit[field] = value;

      return { unit };
    });
  }

  setTrade(value, field) {
    this.setState(state => {
      let trade = { ...state.trade };
      trade[field] = value;

      return { trade };
    });
  }

  render() {
    if (!isAuthenticated() && !isAdminAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    const { api, ui } = this.props;
    let users = [];
    this.state.users.forEach(function(u, i) {
      users.push(
        <option value={u.id} key={i}>
          {u.name}
        </option>
      );
    });

    return (
      <div className="px-4 py-1 w-full h-full flex-grow">
        {this.state.loading && <Loading />}
        {!this.state.show_filter && !this.state.view_deal && (
          <div className="w-full">
            <button
              className="inline-block text-white text-sm rounded-full px-4 py-1 bg-green-400 hover:bg-green-600"
              onClick={() => this.setState({ show_filter: true })}
            >
              Filter
            </button>
            {!isAdminAuthenticated() && (
              <button
                className="inline-block text-white text-sm rounded-full px-4 py-1 bg-green-400 float-right hover:bg-green-600"
                onClick={() => this.newDeal()}
              >
                New Deal
              </button>
            )}
          </div>
        )}
        {this.state.show_filter && !this.state.view_deal && (
          <div className="p-5 w-full my-6 border border-blue-500 rounded-lg">
            <div className="w-full flex flex-row">
              {isAdmin() && (
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3"
                  htmlFor="consultant"
                >
                  <span className="block w-full">Sales Consultant</span>
                  <select
                    className="form-select py-0 w-full"
                    value={this.state.user_id}
                    onChange={event =>
                      this.setState({ user_id: event.target.value })
                    }
                    name="consultant"
                  >
                    <option value={0}>All</option>
                    {users}
                  </select>
                </label>
              )}
              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3">
                <span className="block w-full">Customer</span>
                <input
                  type="text"
                  value={this.state.customer.first_name}
                  onChange={event =>
                    this.setCustomer(event.target.value, "first_name")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={this.state.customer.middle_name}
                  onChange={event =>
                    this.setCustomer(event.target.value, "middle_name")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Middle Name"
                />
                <input
                  type="text"
                  value={this.state.customer.last_name}
                  onChange={event =>
                    this.setCustomer(event.target.value, "last_name")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  value={this.state.customer.phone}
                  onChange={event =>
                    this.setCustomer(event.target.value, "phone")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Phone Number"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3">
                <span className="block w-full">Unit</span>
                <input
                  type="text"
                  value={this.state.unit.stock_number}
                  onChange={event =>
                    this.setUnit(event.target.value, "stock_number")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Stock Number"
                />
                <input
                  type="text"
                  value={this.state.unit.make}
                  onChange={event => this.setUnit(event.target.value, "make")}
                  className="form-input py-0 w-full mb-1"
                  placeholder="Make"
                />
                <input
                  type="text"
                  value={this.state.unit.model}
                  onChange={event => this.setUnit(event.target.value, "model")}
                  className="form-input py-0 w-full mb-1"
                  placeholder="Model"
                />
                <input
                  type="text"
                  value={this.state.unit.model_number}
                  onChange={event =>
                    this.setUnit(event.target.value, "model_number")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Model Number"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3">
                <span className="block w-full">Trade</span>
                <input
                  type="text"
                  value={this.state.trade.make}
                  onChange={event => this.setTrade(event.target.value, "make")}
                  className="form-input py-0 w-full mb-1"
                  placeholder="Make"
                />
                <input
                  type="text"
                  value={this.state.trade.model}
                  onChange={event => this.setTrade(event.target.value, "model")}
                  className="form-input py-0 w-full mb-1"
                  placeholder="Model"
                />
                <input
                  type="text"
                  value={this.state.trade.model_number}
                  onChange={event =>
                    this.setTrade(event.target.value, "model_number")
                  }
                  className="form-input py-0 w-full mb-1"
                  placeholder="Model Number"
                />
              </label>
              <label className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3">
                <span className="block w-full">Customer Type</span>
                <select
                  className="form-select"
                  multiple={true}
                  size={this.state.customer_types.length}
                  value={this.state.customer_type}
                  onChange={e =>
                    this.setState({
                      customer_type: Array.from(
                        e.target.selectedOptions,
                        item => item.value
                      )
                    })
                  }
                >
                  {this.state.customer_types.map((ct, index) => {
                    return (
                      <option value={ct} key={index}>
                        {ct}
                      </option>
                    );
                  })}
                </select>
                <span className="text-xs">Ctrl+Click to select multiple</span>
              </label>
              <div className="block text-gray-700 text-sm font-bold mb-2 w-1/6 pr-3">
                <span className="block w-full">Sales Step</span>
                <div className="w-full inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="sales_status"
                    value="all"
                    checked={this.state.sales_status === "all"}
                    onChange={e =>
                      this.setState({ sales_status: e.target.value })
                    }
                  />
                  <span className="ml-2 font-normal">All</span>
                </div>
                {this.state.sales_steps.map((ss, index) => {
                  return (
                    <div
                      className="w-full inline-flex items-center"
                      key={index}
                    >
                      <input
                        type="radio"
                        className="form-radio"
                        name="sales_status"
                        value={ss}
                        checked={this.state.sales_status === ss}
                        onChange={e =>
                          this.setState({ sales_status: e.target.value })
                        }
                      />
                      <span className="ml-2 font-normal">{ss}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pt-4 px-5 text-right">
              <button
                className="inline-block text-white text-sm rounded-full px-4 py-1 bg-green-400 hover:bg-green-600 mr-6"
                onClick={() => this.getDeals()}
              >
                Search
              </button>
              <button
                className="inline-block text-white text-sm rounded-full px-4 py-1 bg-blue-400 hover:bg-blue-600 mr-6"
                onClick={() => this.resetFilter()}
              >
                Clear
              </button>
              <button
                className="inline-block text-white text-sm rounded-full px-4 py-1 bg-red-400 hover:bg-red-600"
                onClick={() => this.setState({ show_filter: false })}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {!this.state.view_deal && (
          <table className="table-responsive w-full text-gray-800 mt-3 sm:rounded-lg">
            <thead>
              <tr>
                <th className="table-header">Date</th>
                <th className="table-header">Customer</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Consultant</th>
                <th className="table-header">Year</th>
                <th className="table-header">Make</th>
                <th className="table-header">Model</th>
                <th className="table-header">Step</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm lg:text-sm border border-gray-200">
              {this.state.deals.map((deal, index) => {
                let unit_years = deal.units.map(u => u.year);
                let unit_makes = deal.units.map(u => u.make);
                let unit_models = deal.units.map(u => u.model);

                let years = [];
                unit_years.forEach((y, index) => {
                  if (!!y || !!unit_makes[index] || unit_models[index]) {
                    years.push(
                      <span className="w-full block" key={index}>
                        {y ? y : "\u00A0"}
                      </span>
                    );
                  }
                });

                let makes = [];
                unit_makes.forEach((m, index) => {
                  if (!!m || !!unit_years[index] || unit_models[index]) {
                    makes.push(
                      <span className="w-full block" key={index}>
                        {m ? m : "\u00A0"}
                      </span>
                    );
                  }
                });

                let models = [];
                unit_models.forEach((m, index) => {
                  if (!!m || !!unit_makes[index] || unit_years[index]) {
                    models.push(
                      <span className="w-full block" key={index}>
                        {m ? m : "\u00A0"}
                      </span>
                    );
                  }
                });

                return (
                  <tr key={index}>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {deal.deal_date}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {deal.customer.first_name} {deal.customer.last_name}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {deal.customer.phone}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {deal.user.name}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {years}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {makes}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {models}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      {deal.sales_status}
                    </td>
                    <td className="border-b border-gray-200 px-5 py-3">
                      <div className="flex items-center">
                        <svg
                          onClick={() => this.editDeal(deal)}
                          className="fill-current text-green-500 h-4 w-4 mr-6 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
                        </svg>
                        <svg
                          onClick={() => this.deleteDeal(deal)}
                          className="fill-current text-red-500 h-4 w-4 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <Paging
              page="Deals"
              paging={this.state.paging}
              changePage={type => this.getDeals(type)}
              colSpanLeft={5}
              colSpanRight={4}
            />
          </table>
        )}
        {this.state.view_deal && (
          <div className="w-full">
            <div>
              <a
                href="#responsive-header"
                onClick={() =>
                  this.setState({ view_deal: false }, this.getDeals)
                }
              >
                <svg
                  className="inline-block h-4 w-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <polygon points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9" />
                </svg>
                <span className="inline-block">Back</span>
              </a>
            </div>
            <ViewDeal
              api={api}
              ui={ui}
              deal={this.state.edit_deal}
              steps={this.state.sales_steps}
              types={this.state.customer_types}
              users={this.state.users}
              tax_rate={this.state.tax_rate}
              interest={this.state.interest}
              document_fee={this.state.document_fee}
              newDeal={() => this.newDealFromEdit()}
              deleteDeal={() => this.deleteDeal(this.state.edit_deal)}
            />
          </div>
        )}
        {this.state.error}
        {this.state.confirm_delete}
      </div>
    );
  }
}

export default Deals;
