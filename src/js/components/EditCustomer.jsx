import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken
} from "../helpers/auth";
import { apiURL } from "../helpers/url";
import { STATES } from "../helpers/states";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";

class EditCustomer extends React.Component {
  state = {
    customer: null,
    loading: false,
    error: null,
    update_success: false
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    for (let key in this.props.customer) {
      if (!this.props.customer.hasOwnProperty(key)) continue;

      if (key === "note") {
        this.props.customer[key] = this.props.customer[key]
          ? this.props.customer[key].note
          : "";
      } else {
        this.props.customer[key] = this.props.customer[key]
          ? this.props.customer[key]
          : "";
      }
    }

    this.setState({ customer: this.props.customer });
  }

  saveCustomer() {
    this.checkSession();

    const { api, ui, customer } = this.props;

    this.setState({ loading: true });

    let data = {};
    for (let key in this.state.customer) {
      if (!this.state.customer.hasOwnProperty(key)) continue;

      data[key] = this.state.customer[key];
    }

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/customers/" + customer.id,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: data
    })
      .then(() => {
        this.setState({
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
                  We were unable to update the customer.{" "}
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

  setCustomerField(field, value) {
    this.setState(state => {
      let customer = { ...state.customer };
      customer[field] = value;
      return { customer };
    });
  }

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    let states = [];
    for (let key in STATES) {
      states.push(
        <option value={key} key={key}>
          {STATES[key]}
        </option>
      );
    }

    return (
      <div className="py-10 w-full">
        {this.state.loading && <Loading />}
        {this.state.update_success && (
          <div className="w-full p-5 mb-5 bg-green-200 text-green-700 text-md rounded-lg">
            <b>Success.</b> Customer has been updated.
          </div>
        )}
        {this.state.customer && (
          <div className="mb-5 rounded-lg border-blue-500 border p-0">
            <h2 className="px-5 py-2 bg-blue-500 text-white">Edit Customer</h2>
            <div className="p-5">
              <b className="label-customer">First Name</b>
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.first_name}
                onChange={event =>
                  this.setCustomerField("first_name", event.target.value)
                }
              />
              <b className="label-customer">Middle Name</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.middle_name}
                onChange={event =>
                  this.setCustomerField("middle_name", event.target.value)
                }
              />
              <b className="label-customer">Last Name</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.last_name}
                onChange={event =>
                  this.setCustomerField("last_name", event.target.value)
                }
              />
            </div>
            <div className="p-5">
              <b className="label-customer">Email</b>
              <input
                className="input-customer"
                type="email"
                value={this.state.customer.email}
                onChange={event =>
                  this.setCustomerField("email", event.target.value)
                }
              />
              <b className="label-customer">Phone</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.phone}
                onChange={event =>
                  this.setCustomerField("phone", event.target.value)
                }
              />
              <b className="label-customer">Phone 2</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.phone2}
                onChange={event =>
                  this.setCustomerField("phone2", event.target.value)
                }
              />
            </div>
            <div className="p-5">
              <b className="label-customer">Address</b>
              <input
                className="input-customer-wide"
                type="text"
                value={this.state.customer.address}
                onChange={event =>
                  this.setCustomerField("address", event.target.value)
                }
              />
            </div>
            <div className="p-5">
              <b className="label-customer">City</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.city}
                onChange={event =>
                  this.setCustomerField("city", event.target.value)
                }
              />
              <b className="label-customer">State</b>{" "}
              <select
                className="input-customer"
                value={this.state.customer.state}
                onChange={event =>
                  this.setCustomerField("state", event.target.value)
                }
              >
                {states}
              </select>
              <b className="label-customer">Postcode</b>{" "}
              <input
                className="input-customer"
                type="text"
                value={this.state.customer.postcode}
                onChange={event =>
                  this.setCustomerField("postcode", event.target.value)
                }
              />
            </div>
            <div className="p-5">
              <b className="label-customer">Notes</b>
              <textarea
                className="textarea-customer-wide"
                rows={4}
                value={this.state.customer.note}
                onChange={event =>
                  this.setCustomerField("note", event.target.value)
                }
              />
            </div>
            <div className="w-full text-right p-5">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
                onClick={() => this.saveCustomer()}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {this.state.error}
      </div>
    );
  }
}

export default EditCustomer;
