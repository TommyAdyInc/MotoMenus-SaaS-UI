import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken,
  isAdmin
} from "../helpers/auth";
import { apiURL } from "../helpers/url";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";

class Settings extends React.Component {
  state = {
    tax: "",
    interest: "",
    loading: false,
    error: null,
    store_name: "",
    logo: "",
    password: "",
    password_confirm: "",
  };

  constructor(props) {
    super(props);
  }

  getSettings() {
    if (isAdmin) {
      this.checkSession();

      const { api, ui } = this.props;

      this.setState({ loading: true });

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
            tax: data.default_tax_rate,
            interest: data.default_interest_rate
          });
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
  }

  getLogo() {
    this.checkSession();

    const { api, ui } = this.props;

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/settings/logo",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(({ data }) => {
        this.setState({ logo: data.path });
      })
      .catch(error => console.log(error));
  }

  getStoreName() {
    if (isAdmin) {
      this.checkSession();

      const { api, ui } = this.props;

      axios({
        method: "GET",
        url: apiURL(api, ui) + "/settings/store-name",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(({ data }) => {
          this.setState({ store_name: data });
        })
        .catch(error => console.log(error));
    }
  }

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.getSettings();
      this.getLogo();
      this.getStoreName();
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

        <div className="w-full">
          {isAdmin() && (
            <div>
              <div className="mb-5">
                <h2>Store Defaults</h2>
                <b className="inline-block mr-3">Default Interest Rate</b>
                <input
                  className="border border-gray-500 text-right mr-4 rounded-full inline-block pr-2"
                  type="number"
                  value={this.state.interest}
                  onChange={val => this.setState({ interest: val })}
                />
                <b className="inline-block mr-3">Default Tax Rate</b>{" "}
                <input
                  className="border border-gray-500 text-right mr-4 rounded-full inline-block pr-2"
                  type="number"
                  value={this.state.tax}
                  onChange={val => this.setState({ tax: val })}
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm">Save Defaults</button>
              </div>
              <hr className="mb-5" />
              <div className="mb-5">
                <h2>Store Settings</h2>
                <b className="inline-block mr-3">Logo</b> <img alt="logo" className="inline-block mr-3 align-top h-auto" style={{maxWidth: 200 +'px'}} srcSet={this.state.logo} />
                <b className="inline-block mr-3">Store Name </b>{" "}
                <input
                  className="border border-gray-500 text-left mr-4 rounded-full inline-block px-2"
                  type="text"
                  value={this.state.store_name}
                  onChange={val => this.setState({ store_name: val })}
                />
                <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm">Save Name</button>
              </div>
              <hr className="mb-5" />
            </div>
          )}
          <div className="mb-5">
            <h2>User</h2>
            <b className="inline-block mr-3">Change Password</b>{" "}
            <input
              className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
              type="password"
              value={this.state.password}
              onChange={val => this.setState({ password: val })}
            />
            <b className="inline-block mr-3">Confirm Password</b>{" "}
            <input
                className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
                type="password"
                value={this.state.password_confirm}
                onChange={val => this.setState({ password_confirm: val })}
            />
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm">Update Password</button>
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default Settings;
