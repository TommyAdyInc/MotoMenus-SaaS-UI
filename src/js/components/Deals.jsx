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

class Deals extends React.Component {
  state = {
    deals: [],
    loading: false,
    error: null,
    paging: null
  };

  constructor(props) {
    super(props);
  }

  getDeals(paging = null) {
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
      url: "//" + subdomain + api_url + ":" + port + route_prefix + "/deal",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      params: params
    })
      .then(({ data }) => {
        let deals = [...data.data];
        delete data.data;
        let paging = data;

        this.setState({ deals, paging });
      })
      .catch(errors => {
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

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  editDeal(id) {
    console.log(id);
  }

  deleteDeal(id) {
    console.log(id);
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.getDeals();
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
        {!this.state.new_deal && (
          <table className="table-responsive w-full text-blue-500">
            <thead>
              <tr>
                <th className="px-2 py-1 w-1/12 text-md">Date</th>
                <th className="px-2 py-1 w-2/12 text-md">Customer</th>
                <th className="px-2 py-1 w-1/12 text-md">Phone</th>
                <th className="px-2 py-1 w-2/12 text-md">Consultant</th>
                <th className="px-2 py-1 w-1/12 text-md">Year</th>
                <th className="px-2 py-1 w-1/12 text-md">Make</th>
                <th className="px-2 py-1 w-2/12 text-md">Model</th>
                <th className="px-2 py-1 w-1/12 text-md">Step</th>
                <th className="px-2 py-1 w-1/12"></th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm lg:text-sm">
              {this.state.deals.map((deal, index) => {
                return (
                  <tr key={index}>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.deal_date}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.customer.first_name}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.customer.phone}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.user.name}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.units[0].year}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.units[0].make}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.units[0].model}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1">
                      {deal.sales_status}
                    </td>
                    <td className="odd:bg-white even:bg-gray-200 border px-1 py-1 flex items-center">
                      <svg
                        onClick={() => this.editDeal(deal.id)}
                        className="fill-current h-4 w-4 mx-3"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
                      </svg>
                      <svg
                        onClick={() => this.deleteDeal(deal.id)}
                        className="fill-current text-red-500 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
                      </svg>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {this.state.paging && (
                <tr>
                  <td className="text-sm py-2" colSpan={5}>
                    Deals {this.state.paging.from} to {this.state.paging.to} out
                    of {this.state.paging.total}
                  </td>
                  <td className="text-sm py-2" colSpan={4}>
                    <div className="flex align-center justify-end w-full">
                      {this.state.paging.from > 1 && (
                        <a
                          href="#responsive-header"
                          onClick={() => this.getDeals("prev")}
                          className="block mx-2 hover:text-blue-200 text-blue-500 text-sm flex flex-row align-center justify-end"
                        >
                          <svg
                            className="fill-current h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path d="M7.05 9.293L6.343 10 12 15.657l1.414-1.414L9.172 10l4.242-4.243L12 4.343z" />
                          </svg>{" "}
                          <span className="ml-1">Previous</span>
                        </a>
                      )}
                      {this.state.paging.total > this.state.paging.to && (
                        <a
                          href="#responsive-header"
                          onClick={() => this.getDeals("next")}
                          className="ml-5 block mx-2 hover:text-blue-200 text-blue-500 text-sm flex align-center justify-end"
                        >
                          <span className="ml-1">Next</span>{" "}
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

export default Deals;
