import React from "react";
import axios from "axios";
import { getAdminAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";
import CheckMark from "../../helpers/CheckMark.jsx";
import Paging from "../../helpers/Paging.jsx";

class Stores extends React.Component {
  state = {
    loading: false,
    error: null,
    error_save: null,
    stores: [],
    save_store: false,
    paging: null,
    edit_store: null,
    store_name: "",
    fqdn: ""
  };

  constructor(props) {
    super(props);
  }

  getStores(paging = null) {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    let params = {
      admin: 1
    };
    if (paging === "next") {
      params.page = parseInt(this.state.paging.current_page) + 1;
    }

    if (paging === "prev") {
      params.page = parseInt(this.state.paging.current_page) - 1;
    }

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/tenants",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      },
      params: params
    })
      .then(({ data }) => {
        let stores = [...data.data];
        delete data.data;
        let paging = data;

        this.setState({ stores, paging });
      })
      .catch(errors => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>Could not retrieve store settings.</div>
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

  saveStore() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "POST",
      url: apiURL(api, ui) + "/tenants",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      },
      data: {
        store_name: this.state.store_name,
        fqdn:
          this.state.fqdn +
          "." +
          api.subdomain +
          "." +
          ui.domain +
          "." +
          ui.tld,
        admin: 1
      }
    })
      .then(() => {
        this.setState(
          { save_store: true, store_name: "", fqdn: "" },
          this.getStores
        );
        setTimeout(() => this.setState({ save_store: false }), 4000);
      })
      .catch(errors => this.setError(errors))
      .finally(() => this.setState({ loading: false }));
  }

  deactivateStore(store) {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "DELETE",
      url: apiURL(api, ui) + "/tenants/" + store.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      },
      params: {
        admin: 1
      }
    })
      .then(() => (store.deleted_at = "deactivated"))
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  setError(errors) {
    if (errors.response.data.errors["fqdn"]) {
      this.setState({ error_save: "The sub-domain has already been taken!" });
    } else {
      this.setState({ error_save: "Could not create new store." });
    }

    setTimeout(() => this.setState({ error_save: null }), 5000);
  }

  activateStore(store) {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "DELETE",
      url: apiURL(api, ui) + "/tenants/restore/" + store.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAdminAuthToken()
      },
      params: {
        admin: 1
      }
    })
      .then(() => (store.deleted_at = null))
      .catch(errors => console.log(errors))
      .finally(() => this.setState({ loading: false }));
  }

  editStore(store) {
    const { api } = this.props;

    window.location =
      "//" +
      store.hostnames[0].fqdn.replace("." + api.subdomain, "") +
      (process.env.DOCKER_HOST_PORT ? ":" + process.env.DOCKER_HOST_PORT : "");
  }

  componentDidMount() {
    this.getStores();
  }

  render() {
    const { api, ui } = this.props;

    return (
      <div className="px-4 py-1 w-full flex-grow">
        {this.state.loading && <Loading />}

        <div className="w-full">
          <div>
            <div className="mb-5 rounded-lg border-blue-500 border p-0">
              <h2 className="px-5 py-2 bg-blue-500 text-white">Stores</h2>
              <div className="w-full py-4 px-2 flex">
                <b className="block lg:inline-block mr-2">Store Name</b>
                <input
                  className="form-input py-0 w-1/5"
                  type="text"
                  value={this.state.store_name}
                  onChange={event =>
                    this.setState({ store_name: event.target.value })
                  }
                />
                <b className="block lg:inline-block ml-6 mr-2">Sub-Domain</b>{" "}
                <div className="inline-block w-1/3 flex flex-wrap items-stretch relative">
                  <input
                    type="text"
                    value={this.state.fqdn}
                    onChange={event =>
                      this.setState({ fqdn: event.target.value })
                    }
                    className="flex-shrink flex-grow flex-auto leading-normal h-8 w-px flex-1 border border-gray-light rounded rounded-r-none px-3 relative"
                  />
                  <div className="flex -mr-px">
                    <span className="flex items-center leading-normal bg-gray-200 rounded rounded-l-none border border-l-0 border-gray-light px-3 whitespace-no-wrap text-grey-dark text-sm">
                      .{ui.domain + "." + ui.tld}
                    </span>
                  </div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm  ml-6"
                  onClick={() => this.saveStore()}
                >
                  Create New
                </button>
                {this.state.save_store && <CheckMark />}
              </div>
              {this.state.error_save && (
                <div className="w-full text-sm text-red-600 px-2">
                  {this.state.error_save}
                </div>
              )}
              <table className="table-responsive w-full text-gray-900 mt-3 sm:rounded-lg">
                <thead>
                  <tr>
                    <th className="table-header">Store Name</th>
                    <th className="table-header">URL</th>
                    <th className="table-header">Created On</th>
                    <th className="table-header">Status</th>
                    <th className="table-header"></th>
                  </tr>
                </thead>
                <tbody className="text-xs md:text-sm lg:text-sm border border-gray-200">
                  {this.state.stores.map((store, index) => {
                    return (
                      <tr key={index}>
                        <td className="border-b border-gray-200 px-5 py-3">
                          {store.store_name}
                        </td>
                        <td className="border-b border-gray-200 px-5 py-3">
                          {store.hostnames[0].fqdn.replace(
                            "." + api.subdomain,
                            ""
                          )}
                        </td>
                        <td className="border-b border-gray-200 px-5 py-3">
                          {store.date_entered}
                        </td>
                        <td className="border-b border-gray-200 px-5 py-3 text-center">
                          <div
                            className={store.deleted_at ? "inactive" : "active"}
                          >
                            {store.deleted_at ? "Suspended" : "Active"}
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-5 py-3">
                          <div className="flex items-center">
                            {!store.deleted_at && (
                              <svg
                                onClick={() => this.editStore(store)}
                                className="fill-current text-green-500 h-4 w-4 mr-6 cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7.88 7.88l-3.54 7.78 7.78-3.54 3.54-7.78-7.78 3.54zM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                              </svg>
                            )}
                            {store.deleted_at ? (
                              <svg
                                onClick={() => this.activateStore(store)}
                                className="fill-current text-blue-500 h-4 w-4 cursor-pointer ml-10"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                              >
                                <path d="M53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32zm70.11-175.8l89.38-94.26a15.41 15.41 0 0 1 22.62 0l89.38 94.26c10.08 10.62 2.94 28.8-11.32 28.8H256v112a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V320h-57.37c-14.26 0-21.4-18.18-11.32-28.8zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
                              </svg>
                            ) : (
                              <svg
                                onClick={() => this.deactivateStore(store)}
                                className="fill-current text-red-500 h-4 w-4 cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
                              </svg>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <Paging
                  page="Stores"
                  paging={this.state.paging}
                  changePage={type => this.getStores(type)}
                  colSpanLeft={3}
                  colSpanRight={2}
                />
              </table>
            </div>
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default Stores;
