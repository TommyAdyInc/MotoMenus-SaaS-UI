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

class EditUser extends React.Component {
  state = {
    name: "",
    email: "",
    role: "user",
    password: "",
    password_confirm: "",
    password_error: false,
    loading: false,
    error: null,
    update_success: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      name: this.props.user.name,
      email: this.props.user.email,
      role: this.props.user.role,
    })
  }

  saveUser() {
    if (this.state.password !== this.state.password_confirm) {
      this.setState({ password_error: true });

      return;
    }

    this.setState({ password_error: false });
    this.checkSession();

    const { api, ui, user } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/users/" + user.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        role: this.state.role
      }
    })
      .then(() => {
        this.setState({
          password: "",
          password_confirm: "",
          update_success: true
        });
        setTimeout(() => this.setState({ update_success: false }), 4000);
      })
      .catch(errors => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>
                  We were unable to update the user.{" "}
                  {errors.error ||
                    Object.values(errors.response.data.errors).join(", ")}
                </div>
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

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    return (
      <div className="py-10 w-full">
        {this.state.loading && <Loading />}
        {this.state.update_success && (
          <div className="w-full p-5 mb-5 bg-green-200 text-green-700 text-md rounded-lg">
            <b>Success.</b> User has been updated.
          </div>
        )}
        <div className="mb-5 rounded-lg border-blue-500 border p-0">
          <h2 className="px-5 py-2 bg-blue-500 text-white">Edit User</h2>
          <div className="p-5">
            <b
              className="block lg:inline-block mr-3 text-md w-1/4"
              style={{ maxWidth: 200 + "px" }}
            >
              Full Name
            </b>
            <input
              className="border border-gray-500 mr-4 rounded-full inline-block px-2"
              type="text"
              value={this.state.name}
              onChange={event => this.setState({ name: event.target.value })}
            />
            <b
              className="block lg:inline-block mr-3 ml-8 text-md w-1/4"
              style={{ maxWidth: 200 + "px" }}
            >
              Email
            </b>{" "}
            <input
              className="border border-gray-500 mr-4 rounded-full inline-block px-2"
              type="email"
              value={this.state.email}
              onChange={event => this.setState({ email: event.target.value })}
            />
          </div>
          <div className="p-5">
            <b
              className="block lg:inline-block mr-3 text-md w-1/4"
              style={{ maxWidth: 200 + "px" }}
            >
              Password
            </b>{" "}
            <input
              className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
              type="password"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.target.value })
              }
            />
            <b
              className="block lg:inline-block mr-3 ml-8 text-md w-1/4"
              style={{ maxWidth: 200 + "px" }}
            >
              Confirm Password
            </b>{" "}
            <input
              className="border border-gray-500 px-2 mr-4 rounded-full inline-block"
              type="password"
              value={this.state.password_confirm}
              onChange={event =>
                this.setState({ password_confirm: event.target.value })
              }
            />
            <br />
            {this.state.password_error && (
              <div className="text-red-500 text-sm">
                Passwords do not match!!
              </div>
            )}
          </div>
          <div className="p-5">
            <b
              className="block lg:inline-block mr-3 text-md w-1/4"
              style={{ maxWidth: 200 + "px" }}
            >
              Role
            </b>{" "}
            <select
              className="border border-gray-500 text-right rounded-full inline-block px-3"
              value={this.state.role}
              onChange={event => this.setState({ role: event.target.value })}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="w-full text-right p-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
              onClick={() => this.saveUser()}
            >
              Save
            </button>
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default EditUser;
