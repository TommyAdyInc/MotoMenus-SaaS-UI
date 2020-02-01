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
import CheckMark from "../helpers/CheckMark.jsx";
import Dropzone from "react-dropzone";

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
    password_error: false,
    drop_rejected: false,
    save_defaults: false,
    save_store_name: false,
    save_user: false,
    user: null
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
    if (isAdmin) {
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
  }

  getUser() {
    this.checkSession();

    const { api, ui } = this.props;

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/user",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => {
        this.setState({ user: data });
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

  logoUpload(file) {
    const { api, ui } = this.props;
    let formData = new FormData();
    formData.append("file", file[0]);

    this.setState({ loading: true });
    axios({
      method: "POST",
      url: apiURL(api, ui) + "/settings/logo",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: formData
    })
      .then(({ data }) => {
        this.setState({ logo: data.url });
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  setDefaults() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/settings",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        default_tax_rate: this.state.tax,
        default_interest_rate: this.state.interest
      }
    })
      .then(({ data }) => {
        this.setState({ save_defaults: true });
        setTimeout(() => this.setState({ save_defaults: false }), 4000);
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  updateStoreName() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/settings/store-name",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        name: this.state.store_name
      }
    })
      .then(({ data }) => {
        this.setState({ save_store_name: true });
        setTimeout(() => this.setState({ save_store_name: false }), 4000);
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  updateUser() {
    if (this.state.password !== this.state.password_confirm) {
      this.setState({ password_error: true });

      return;
    }

    if (!this.state.user) {
      return;
    }

    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/users/" + this.state.user.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        password: this.state.password
      }
    })
      .then(({ data }) => {
        this.setState({
          save_user: true,
          password: "",
          password_confirm: "",
          password_error: false
        });
        setTimeout(() => this.setState({ save_user: false }), 4000);
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  dropRejected() {
    this.setState({ drop_rejected: true });

    setTimeout(() => this.setState({ drop_rejected: false }), 4000);
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
      this.getUser();
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
              <div className="mb-5 rounded-lg border-blue-500 border p-0">
                <h2 className="px-5 py-2 bg-blue-500 text-white">
                  Store Defaults
                </h2>
                <div className="p-5">
                  <b className="inline-block mr-3">Default Interest Rate</b>
                  <input
                    className="border border-gray-500 text-right mr-4 rounded-full inline-block pr-2"
                    type="number"
                    value={this.state.interest}
                    onChange={event =>
                      this.setState({ interest: event.target.value })
                    }
                  />
                  <b className="inline-block mr-3">Default Tax Rate</b>{" "}
                  <input
                    className="border border-gray-500 text-right mr-4 rounded-full inline-block pr-2"
                    type="number"
                    value={this.state.tax}
                    onChange={event =>
                      this.setState({ tax: event.target.value })
                    }
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
                    onClick={() => this.setDefaults()}
                  >
                    Save Defaults
                  </button>
                  {this.state.save_defaults && <CheckMark />}
                </div>
              </div>

              <div className="mb-5 rounded-lg border-blue-500 border p-0">
                <h2 className="px-5 py-2 bg-blue-500 text-white">
                  Store Settings
                </h2>
                <div className="p-5">
                  <b className="inline-block mr-3">Logo</b>{" "}
                  <div
                    className="inline-block mr-10 align-top w-1/4 mb-10"
                    style={{ width: 200 + "px" }}
                  >
                    {this.state.logo && (
                      <img
                        alt="logo"
                        className="align-top h-auto"
                        style={{ maxWidth: 200 + "px" }}
                        srcSet={this.state.logo}
                      />
                    )}
                  </div>
                  <Dropzone
                    accept={["image/png", "image/jpeg", "image/jpg"]}
                    multiple={false}
                    onDrop={acceptedFiles => this.logoUpload(acceptedFiles)}
                    onDropRejected={() => this.dropRejected()}
                  >
                    {({ getRootProps, getInputProps, isDragActive }) => (
                      <section
                        className="align-top inline-block border rounded-lg shadow-inner border-blue-500 lg:w-1/4 sm:w-1/2 p-5 mb-10"
                        style={{ height: 100 + "px" }}
                      >
                        <div {...getRootProps()} className="h-full w-full">
                          <input {...getInputProps()} />
                          {isDragActive ? (
                            <p>Drop the logo here ...</p>
                          ) : (
                            <p>
                              Drag n drop your logo here, or click to select
                              files (PNG or JPG)
                            </p>
                          )}
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {this.state.drop_rejected && (
                    <div className="ml-10 align-top inline-block border rounded-lg shadow-inner border-red-500 bg-red-100 lg:w-1/4 sm:w-1/2 p-5 text-red-600">
                      Only one file can be selected and must be either a PNG or
                      JPG.
                    </div>
                  )}
                  <br />
                  <b className="inline-block mr-3">Store Name </b>{" "}
                  <input
                    className="border border-gray-500 text-left mr-4 rounded-full inline-block px-2"
                    type="text"
                    value={this.state.store_name}
                    onChange={event =>
                      this.setState({ store_name: event.target.value })
                    }
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
                    onClick={() => this.updateStoreName()}
                  >
                    Save Name
                  </button>
                  {this.state.save_store_name && <CheckMark />}
                </div>
              </div>
            </div>
          )}
          <div className="mb-5 rounded-lg border-blue-500 border p-0">
            <h2 className="px-5 py-2 bg-blue-500 text-white">User</h2>
            <div className="p-5">
              <b className="inline-block mr-3">Change Password</b>{" "}
              <input
                className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
                type="password"
                value={this.state.password}
                onChange={event =>
                  this.setState({ password: event.target.value })
                }
              />
              <b className="inline-block mr-3">Confirm Password</b>{" "}
              <input
                className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
                type="password"
                value={this.state.password_confirm}
                onChange={event =>
                  this.setState({ password_confirm: event.target.value })
                }
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
                onClick={() => this.updateUser()}
              >
                Update Password
              </button>
              {this.state.save_user && <CheckMark />}
              <br />
              {this.state.password_error && (
                <div className="text-red-500 text-sm">
                  Passwords do not match!!
                </div>
              )}
            </div>
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default Settings;
