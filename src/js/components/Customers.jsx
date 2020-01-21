import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken
} from "../helpers/auth";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";

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

    const { port, route_prefix, api_url } = this.props.api;
    const { subdomain } = this.props;

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
      url:
        "//" + subdomain + api_url + ":" + port + route_prefix + "/customers",
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
      .catch(errors => {
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
    console.log(id);
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
      <div className="px-4 py-4 w-full h-full flex-grow">
        {this.state.loading && <Loading />}
        {!this.state.new_customer && (
          <table className="table-responsive w-full text-gray-900">
            <thead>
              <tr>
                <th className="px-2 py-1 w-1/4 text-md">Name</th>
                <th className="px-2 py-1 w-1/4 text-md">Address</th>
                <th className="px-2 py-1 w-2/12 text-md">Phone</th>
                <th className="px-2 py-1 w-1/4 text-md">Email</th>
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
            <tfoot>
              {this.state.paging && (
                <tr>
                  <td className="text-sm py-2" colSpan={2}>
                    Customers {this.state.paging.from} to {this.state.paging.to}{" "}
                    out of {this.state.paging.total}
                  </td>
                  <td className="text-sm py-2" colSpan={3}>
                    <div className="flex align-center justify-end w-full">
                      {this.state.paging.from > 1 && (
                        <a
                          href="#responsive-header"
                          onClick={() => this.getCustomers("prev")}
                          className="block border border-gray-400 border-r-0 rounded-l-full border p-1 pl-2 pr-2 ml-3 hover:text-blue-300 text-blue-600 text-sm mt-2"
                        >
                          <svg
                            className="fill-current h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
                          </svg>
                        </a>
                      )}
                      <div
                        className={
                          "font-semibold ml-0 mr-0 border border-gray-400 p-1 pl-2 pr-2 block text-blue-600 mt-2 " +
                          (this.state.paging.total <= this.state.paging.to
                            ? "rounded-r"
                            : "") +
                          (parseInt(this.state.paging.from) === 1
                            ? " rounded-l"
                            : "")
                        }
                      >
                        {this.state.paging.current_page} OF{" "}
                        {this.state.paging.last_page}
                      </div>
                      {this.state.paging.total > this.state.paging.to && (
                        <a
                          href="#responsive-header"
                          onClick={() => this.getCustomers("next")}
                          className="ml-0 border border-gray-400 border-l-0 rounded-r-full p-1 pl-2 pr-2 block mr-3 hover:text-blue-300 text-blue-600 text-sm mt-2"
                        >
                          <svg
                            className="fill-current h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
        )}
        {this.state.error}
      </div>
    );
  }
}

export default Customers;
