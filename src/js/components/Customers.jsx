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
import Paging from "../helpers/Paging.jsx";

class Customers extends React.Component {
  state = {
    customers: [],
    loading: false,
    error: null,
    paging: null,
    new_customer: false
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

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  editCustomer(id) {
    // console.log(id);
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.getCustomers();
    }
  }

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    return (
      <div className="px-4 py-1 w-full h-full flex-grow">
        {this.state.loading && <Loading />}
        {!this.state.new_customer && (
          <table className="table-responsive w-full text-gray-900">
            <thead>
              <tr>
                <th className="px-2 py-1 w-1/4 text-md text-left">Name</th>
                <th className="px-2 py-1 w-1/4 text-md text-left">Address</th>
                <th className="px-2 py-1 w-2/12 text-md text-left">Phone</th>
                <th className="px-2 py-1 w-1/4 text-md text-left">Email</th>
                <th className="px-2 py-1 w-1/12"></th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm lg:text-sm">
              {this.state.customers.map((customer, index) => {
                return (
                  <tr key={index} className="odd:bg-white even:bg-gray-200">
                    <td className="border px-1 py-1">
                      {customer.first_name} {customer.last_name}
                    </td>
                    <td className="border px-1 py-1">
                      {customer.address}, {customer.city}, {customer.state}{" "}
                      {customer.postcode}
                    </td>
                    <td className="border px-1 py-1">{customer.phone}</td>
                    <td className="border px-1 py-1">{customer.email}</td>
                    <td className="border px-1 py-1">
                      <div className="flex items-center">
                        <svg
                          onClick={() => this.editCustomer(customer.id)}
                          className="fill-current text-green-500 h-4 w-4 mx-3 cursor-pointer"
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
              paging={this.state.paging}
              changePage={type => this.getCustomers(type)}
              colSpanLeft={3}
              colSpanRight={2}
            />
          </table>
        )}
        {this.state.error}
      </div>
    );
  }
}

export default Customers;
