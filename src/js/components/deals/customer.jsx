import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";

class DealCustomer extends React.Component {
  state = {
    customer: {
      first_name: "",
      middle_name: "",
      last_name: "",
      phone: "",
      phone2: "",
      email: "",
      address: "",
      city: "",
      state: "",
      postcode: "",
      note: ""
    }
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.customer) {
      let customer = this.props.customer;

      for (let key in customer) {
        if (!customer.hasOwnProperty(key)) continue;
        if (customer[key] === null) {
          customer[key] = "";
        }

        if (key === "note" && !!customer[key]) {
          customer[key] = customer[key].note;
        }
      }

      this.setState({ customer });
    }
  }

  setCustomer(value, field) {
    this.setState(state => {
      let customer = { ...state.customer };
      customer[field] = value;

      return { customer };
    }, this.customerUpdated);
  }

  customerUpdated() {
    this.props.customerUpdated(this.state.customer);
  }

  render() {
    let states = [];
    for (let key in STATES) {
      states.push(
        <option value={key} key={key}>
          {STATES[key]}
        </option>
      );
    }

    const { className } = this.props;
    return (
      <label
        className={
          "block text-gray-700 text-sm font-bold mb-2 w-1/2 pr-3 " + className
        }
      >
        <span className="block w-full text-lg b-2">Customer Info</span>
        <div className="flex flex-row w-full">
          <input
            type="text"
            value={this.state.customer.first_name}
            onChange={event =>
              this.setCustomer(event.target.value, "first_name")
            }
            className="form-input py-1 mb-1 w-1/3"
            placeholder="First Name"
          />
          <input
            type="text"
            value={this.state.customer.middle_name}
            onChange={event =>
              this.setCustomer(event.target.value, "middle_name")
            }
            className="form-input py-1 mb-1 mx-2 w-1/3"
            placeholder="Middle Name"
          />
          <input
            type="text"
            value={this.state.customer.last_name}
            onChange={event =>
              this.setCustomer(event.target.value, "last_name")
            }
            className="form-input py-1 mb-1 w-1/3"
            placeholder="Last Name"
          />
        </div>
        <div className="flex flex-row w-full">
          <input
            type="text"
            value={this.state.customer.email}
            onChange={event => this.setCustomer(event.target.value, "email")}
            className="form-input py-1 mb-1 w-1/2"
            placeholder="Email"
          />
          <input
            type="text"
            value={this.state.customer.phone}
            onChange={event => this.setCustomer(event.target.value, "phone")}
            className="form-input py-1 mb-1 mx-2 w-1/4"
            placeholder="Phone Number"
          />
          <input
            type="text"
            value={this.state.customer.phone2}
            onChange={event => this.setCustomer(event.target.value, "phone2")}
            className="form-input py-1 mb-1 w-1/4"
            placeholder="Phone Two"
          />
        </div>
        <div className="flex flex-row w-full">
          <input
            type="text"
            value={this.state.customer.address}
            onChange={event => this.setCustomer(event.target.value, "address")}
            className="form-input py-1 mb-1 w-full"
            placeholder="Address"
          />
        </div>
        <div className="flex flex-row w-full">
          <input
            type="text"
            value={this.state.customer.city}
            onChange={event => this.setCustomer(event.target.value, "city")}
            className="form-input py-1 mb-1 w-1/2"
            placeholder="City"
          />
          <select
            className="form-select py-1 w-1/4 mx-2"
            value={this.state.customer.state}
            onChange={event => this.setCustomer("state", event.target.value)}
          >
            {states}
          </select>
          <input
            type="text"
            value={this.state.customer.postcode}
            onChange={event => this.setCustomer(event.target.value, "postcode")}
            className="form-input py-1 mb-1 w-1/4"
            placeholder="Postcode"
          />
        </div>
        <div className="flex flex-row w-full">
          <textarea
            value={this.state.customer.note}
            onChange={event => this.setCustomer(event.target.value, "note")}
            className="form-input py-1 mb-1 w-full"
            placeholder="Customer Notes"
            rows={2}
          />
        </div>
      </label>
    );
  }
}

export default DealCustomer;
