import React from "react";
import axios from "axios";
import {
  setAdminLogin,
  isAdminAuthenticated,
  adminLogout
} from "../helpers/auth";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";
import { apiURL } from "../helpers/url";
import logo from "../../graphics/logo.png";
import DocumentFee from "./admin/DocumentFee.jsx";

class Admin extends React.Component {
  state = {
    element_to_render: null,
    authenticated: false,
    loading: false
  };

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state.authenticated = isAdminAuthenticated();
  }

  login(event) {
    event.preventDefault();

    this.setState({ loading: true });
    const { oauth_id, oauth_secret } = this.props.api;
    const { api, ui } = this.props;
    const form_data = new FormData(event.target);

    axios({
      method: "post",
      url: apiURL(api, ui) + "/oauth/token",
      data: {
        grant_type: "password",
        client_id: oauth_id,
        client_secret: oauth_secret,
        username: form_data.get("email"),
        password: form_data.get("password"),
        provider: "superadmins",
        scope: ""
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(({ data }) => {
        setAdminLogin(data, !!form_data.get("remember"));
        this.props.onLogin();
        this.setState({ authenticated: true });
      })
      .catch(() => {
        let element_to_render = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>We were unable to find a matching record.</div>
              </span>
              <button
                className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full"
                onClick={() => this.setState({ element_to_render: null })}
              >
                Close
              </button>
            </div>
          </Modal>
        );

        this.setState({ element_to_render });
      })
      .finally(() => this.setState({ loading: false }));
  }

  render() {
    const { onLogout, ui, api } = this.props;

    return (
      <div className="bg-blue-400 h-screen w-screen">
        {this.state.loading && <Loading />}
        {!this.state.authenticated && (
          <div className="flex flex-col items-center flex-1 h-full justify-center">
            <div className="flex rounded-lg shadow-xl w-full sm:w-3/4 md:w-3/4 lg:w-1/3 bg-white sm:mx-0">
              <div className="flex flex-col w-full p-4">
                <div className="flex flex-col flex-1 justify-center mb-8">
                  <h1 className="text-4xl text-center font-thin">
                    Log in to {process.env.APP_NAME}
                  </h1>
                  <div className="w-full mt-4">
                    <form
                      className="form-horizontal w-3/4 mx-auto"
                      onSubmit={this.login}
                    >
                      <div className="flex flex-col mt-4">
                        <input
                          autoComplete="username"
                          id="email"
                          type="text"
                          className="flex-grow h-8 px-2 border rounded border-gray-400"
                          name="email"
                          placeholder="Email"
                        />
                      </div>
                      <div className="flex flex-col mt-4">
                        <input
                          autoComplete="current-password"
                          id="password"
                          type="password"
                          className="flex-grow h-8 px-2 rounded border border-gray-400"
                          name="password"
                          required
                          placeholder="Password"
                        />
                      </div>
                      <div className="flex flex-col mt-8">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded"
                        >
                          Login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.authenticated && (
          <div className="h-full flex flex-col">
            <nav className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-8" src={logo} alt={"logo"} />
                    </div>
                  </div>
                  <div className="block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <div className="ml-3 relative">
                        <div>
                          <a
                            href="#responsive-header"
                            onClick={() => {
                              adminLogout();
                              onLogout();
                            }}
                            className="nav-item"
                          >
                            Logout
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold leading-tight text-gray-900">
                  Admin Dashboard
                </h2>
              </div>
            </header>
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-full">
                <div className="px-4 py-6 sm:px-0 h-full">
                  <div className="bg-white border border-gray-200 rounded-lg min-h-full shadow p-5 h-full">
                    <DocumentFee ui={ui} api={api} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
        {this.state.element_to_render}
      </div>
    );
  }
}

export default Admin;
