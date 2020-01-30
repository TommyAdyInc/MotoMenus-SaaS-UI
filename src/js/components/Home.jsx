import React from "react";
import axios from "axios";
import { setLogin, isAuthenticated } from "../helpers/auth";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";
import { apiURL } from "../helpers/url";
import { Redirect } from "@reach/router";

class Home extends React.Component {
  state = {
    element_to_render: null,
    authenticated: false,
    loading: false
  };

  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state.authenticated = isAuthenticated();
  }

  login(event) {
    event.preventDefault();

    this.setState({ loading: true });
    const {
      port,
      route_prefix,
      oauth_id,
      oauth_secret,
      api_url
    } = this.props.api;
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
        provider: "users",
        scope: ""
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(({ data }) => {
        setLogin(data, !!form_data.get("remember"));
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
    if (this.state.authenticated) {
      return <Redirect noThrow={true} to="/deals" />;
    }

    return (
      <div className="bg-blue-400 h-screen w-screen">
        {this.state.loading && <Loading />}
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
                    <div className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        name="remember"
                        id="remember"
                        className="mr-2"
                      />{" "}
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember Me
                      </label>
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
                  <div className="text-center mt-4">
                    <a
                      className="no-underline hover:underline text-blue-600 text-xs"
                      href="/"
                    >
                      Forgot Your Password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.element_to_render}
      </div>
    );
  }
}

export default Home;
