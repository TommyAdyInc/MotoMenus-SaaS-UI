import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  isAdminAuthenticated,
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
import EditCustomer from "./EditCustomer.jsx";
import { STATES } from "../helpers/states";
import { downloadCsv } from "../helpers/download";

class Customers extends React.Component {
  state = {
    customers: [],
    users: [],
    loading: false,
    error: null,
    paging: null,
    new_customer: false,
    edit_customer: null,
    filter: {
      first_name: "",
      last_name: "",
      email: "",
      city: "",
      state: "",
      postcode: "",
      phone: "",
      user_id: 0
    },
    show_filters: false
  };

  constructor(props) {
    super(props);
  }

  getCustomers(paging = null) {
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

    for (let key in this.state.filter) {
      if (this.state.filter[key]) {
        params[key] = this.state.filter[key];
      }
    }

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/customers",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      params: params
    })
      .then(({ data }) => {
        let customers = [...data.data];
        delete data.data;
        let paging = data;

        this.setState({ customers, paging });
      })
      .catch(() => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>Could not retrieve customers.</div>
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

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  componentDidMount() {
    if (isAuthenticated() || isAdminAuthenticated()) {
      this.getCustomers();
      if (isAdmin()) {
        this.getUsers();
      }
    }
  }

  exportToCSV() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    let params = {};
    for (let key in this.state.filter) {
      if (this.state.filter[key]) {
        params[key] = this.state.filter[key];
      }
    }

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/customers/export",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      params: params
    })
      .then(({ data }) =>
        downloadCsv(
          data,
          "Customers-" + new Date().toLocaleDateString() + ".csv"
        )
      )
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  setFilterField(field, value) {
    this.setState(state => {
      let filter = { ...state.filter };
      filter[field] = value;
      return { filter };
    });
  }

  clearFilters() {
    this.setState(
      {
        filter: {
          first_name: "",
          last_name: "",
          email: "",
          city: "",
          state: "",
          postcode: "",
          phone: "",
          user_id: 0
        }
      },
      this.getCustomers
    );
  }

  render() {
    if (!isAuthenticated() && !isAdminAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    const { api, ui } = this.props;

    let states = [];
    for (let key in STATES) {
      states.push(
        <option value={key} key={key}>
          {STATES[key]}
        </option>
      );
    }

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
        {!this.state.edit_customer && (
          <div>
            {!this.state.show_filter && (
              <div>
                <button
                  className="inline-block text-white text-sm rounded-full px-4 py-1 bg-green-400 hover:bg-green-600"
                  onClick={() => this.setState({ show_filter: true })}
                >
                  Filter
                </button>
                <button
                  className="inline-block text-white text-sm rounded-full px-4 py-1 bg-blue-400 hover:bg-blue-600 ml-6"
                  onClick={() => this.exportToCSV()}
                >
                  Export
                </button>
              </div>
            )}
            {this.state.show_filter && (
              <div className="p-5 w-full my-6 border border-blue-500 rounded-lg">
                <div className="py-1 px-5">
                  <b className="label-customer">First Name</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.first_name}
                    onChange={event =>
                      this.setFilterField("first_name", event.target.value)
                    }
                  />
                  <b className="label-customer">Last Name</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.last_name}
                    onChange={event =>
                      this.setFilterField("last_name", event.target.value)
                    }
                  />
                  <b className="label-customer">Email</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="email"
                    value={this.state.filter.email}
                    onChange={event =>
                      this.setFilterField("email", event.target.value)
                    }
                  />
                </div>
                <div className="py-1 px-5">
                  <b className="label-customer">Phone</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.phone}
                    onChange={event =>
                      this.setFilterField("phone", event.target.value)
                    }
                  />
                  <b className="label-customer">Address</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.address}
                    onChange={event =>
                      this.setFilterField("address", event.target.value)
                    }
                  />
                  <b className="label-customer">City</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.city}
                    onChange={event =>
                      this.setFilterField("city", event.target.value)
                    }
                  />
                </div>
                <div className="py-1 px-5">
                  <b className="label-customer">State</b>
                  <select
                    className="form-select py-0 w-1/6"
                    value={this.state.filter.state}
                    onChange={event =>
                      this.setFilterField("state", event.target.value)
                    }
                  >
                    {states}
                  </select>
                  <b className="label-customer">Postcode</b>
                  <input
                    className="form-input py-0 w-1/6"
                    type="text"
                    value={this.state.filter.postcode}
                    onChange={event =>
                      this.setFilterField("postcode", event.target.value)
                    }
                  />
                  {isAdmin() && <b className="label-customer">User</b>}
                  {isAdmin() && (
                    <select
                      className="form-select py-0 w-1/6"
                      value={this.state.filter.user_id}
                      onChange={event =>
                        this.setFilterField("user_id", event.target.value)
                      }
                    >
                      <option value={0}>All</option>
                      {users}
                    </select>
                  )}
                </div>
                <div className="pt-4 px-5 text-right">
                  <button
                    className="inline-block text-white text-sm rounded-full px-4 py-1 bg-green-400 hover:bg-green-600 mr-6"
                    onClick={() => this.getCustomers()}
                  >
                    Search
                  </button>
                  <button
                    className="inline-block text-white text-sm rounded-full px-4 py-1 bg-blue-400 hover:bg-blue-600 mr-6"
                    onClick={() => this.clearFilters()}
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
            <table className="table-responsive w-full text-gray-800 mt-3 sm:rounded-lg">
              <thead>
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Address</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Email</th>
                  <th className="table-header"></th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm lg:text-sm border-gray-200 border">
                {this.state.customers.map((customer, index) => {
                  return (
                    <tr key={index}>
                      <td className="border-b border-gray-200 px-5 py-3">
                        {customer.first_name} {customer.last_name}
                      </td>
                      <td className="border-b border-gray-200 px-5 py-3">
                        {customer.address}, {customer.city}, {customer.state}{" "}
                        {customer.postcode}
                      </td>
                      <td className="border-b border-gray-200 px-5 py-3">
                        {customer.phone}
                      </td>
                      <td className="border-b border-gray-200 px-5 py-3">
                        {customer.email}
                      </td>
                      <td className="border-b border-gray-200 px-5 py-3">
                        <div className="flex items-center">
                          <svg
                            onClick={() =>
                              this.setState({ edit_customer: customer })
                            }
                            className="fill-current text-green-500 h-4 w-4 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <Paging
                page="Customers"
                paging={this.state.paging}
                changePage={type => this.getCustomers(type)}
                colSpanLeft={3}
                colSpanRight={2}
              />
            </table>
          </div>
        )}
        {this.state.edit_customer && (
          <div className="w-full">
            <div>
              <a
                href="#responsive-header"
                onClick={() =>
                  this.setState({ edit_customer: null }, this.getCustomers)
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
            <EditCustomer
              api={api}
              ui={ui}
              customer={this.state.edit_customer}
            />
          </div>
        )}
        {this.state.error}
      </div>
    );
  }
}

export default Customers;
