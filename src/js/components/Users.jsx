import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken
} from "../helpers/auth";
import{apiURL} from "../helpers/url";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";

class Users extends React.Component {
  state = {
    users: [],
    loading: false,
    error: null,
    paging: null,
    new_user: false
  };

  constructor(props) {
    super(props);
  }

  getUsers(paging = null) {
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
      url: apiURL(api, ui) + "/users",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      params: params
    })
      .then(({ data }) => {
        let users = [...data.data];
        delete data.data;
        let paging = data;

        this.setState({ users, paging });
      })
      .catch(() => {
        let error = (
          <Modal>
            <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
              <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                Error!
              </span>
              <span className="inline-flex px-2">
                <div>Could not retrieve users.</div>
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

  editUser(id) {
    // console.log(id);
  }

  enableUser(id) {
    // console.log(id);
  }

  disableUser(id) {
    // console.log(id);
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.getUsers();
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
        {!this.state.new_user && (
          <table className="table-responsive w-full text-gray-900">
            <thead>
              <tr>
                <th className="px-2 py-1 w-1/4 text-md">Name</th>
                <th className="px-2 py-1 w-1/4 text-md">Email</th>
                <th className="px-2 py-1 w-2/12 text-md">Role</th>
                <th className="px-2 py-1 w-2/12 text-md">Status</th>
                <th className="px-2 py-1 w-1/12"></th>
              </tr>
            </thead>
            <tbody className="text-xs md:text-sm lg:text-sm">
              {this.state.users.map((user, index) => {
                return (
                  <tr key={index} className="odd:bg-white even:bg-gray-200">
                    <td className="border px-1 py-1">{user.name}</td>
                    <td className="border px-1 py-1">{user.email}</td>
                    <td className="border px-1 py-1">{user.role}</td>
                    <td className="border px-1 py-1 text-center">
                      <div
                        className={
                          "inline-block text-white text-sm rounded-full px-4 py-1 " +
                          (user.deleted_at ? "bg-red-400" : "bg-green-400")
                        }
                      >
                        {user.deleted_at ? "Disabled" : "Enabled"}
                      </div>
                    </td>
                    <td className="border px-1 py-1">
                      <div className="flex items-center">
                        <svg
                          onClick={() => this.editUser(user.id)}
                          className="fill-current text-green-500 h-4 w-4 mx-3 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
                        </svg>
                        {user.deleted_at ? (
                          <svg
                            onClick={() => this.enableUser(user.id)}
                            className="fill-current text-blue-500 h-4 w-4 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32zm70.11-175.8l89.38-94.26a15.41 15.41 0 0 1 22.62 0l89.38 94.26c10.08 10.62 2.94 28.8-11.32 28.8H256v112a16 16 0 0 1-16 16h-32a16 16 0 0 1-16-16V320h-57.37c-14.26 0-21.4-18.18-11.32-28.8zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path>
                          </svg>
                        ) : (
                          <svg
                            onClick={() => this.disableUser(user.id)}
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
            <tfoot>
              {this.state.paging && (
                <tr>
                  <td className="text-sm py-2" colSpan={2}>
                    Users {this.state.paging.from} to {this.state.paging.to} out
                    of {this.state.paging.total}
                  </td>
                  <td className="text-sm py-2" colSpan={3}>
                    <div className="flex align-center justify-end w-full">
                      {this.state.paging.from > 1 && (
                        <a
                          href="#responsive-header"
                          onClick={() => this.getUsers("prev")}
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
                          onClick={() => this.getUsers("next")}
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

export default Users;
