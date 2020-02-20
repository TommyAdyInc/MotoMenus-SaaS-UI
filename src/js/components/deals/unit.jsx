import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import DealPurchase from "./purchase.jsx";

class SingleUnit extends React.Component {
  state = {
    show_purchase_info: false,
    unit: this.props.unit
  };

  constructor(props) {
    super(props);
  }

  setUnit(value, field) {
    this.setState(state => {
      let unit = { ...state.unit };
      unit[field] = value;

      return { unit };
    }, this.unitUpdated);
  }

  unitUpdated() {
    this.props.unitUpdated(this.state.unit);
  }

  deleteUnit() {
    const { ui, api } = this.props;

    if (this.state.unit.id) {
      axios({
        method: "DELETE",
        url:
          apiURL(api, ui) +
          "/units/" +
          this.state.unit.deal_id +
          "/" +
          this.state.unit.id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(() => this.removeFromState())
        .catch(errors => console.log(errors));
    } else {
      this.removeFromState();
    }
  }

  removeFromState() {
    this.props.removeFromState();
  }

  render() {
    return (
      <div className="w-full block">
        <div className="flex flex-row">
          <input
            type="text"
            value={this.state.unit.stock_number}
            onChange={event => this.setUnit(event.target.value, "stock_number")}
            className="form-input py-1 mb-1 w-1/8"
            placeholder="Stock Number"
          />
          <input
            type="text"
            value={this.state.unit.year}
            onChange={event => this.setUnit(event.target.value, "year")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Year"
          />
          <input
            type="text"
            value={this.state.unit.make}
            onChange={event => this.setUnit(event.target.value, "make")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Make"
          />
          <input
            type="text"
            value={this.state.unit.model}
            onChange={event => this.setUnit(event.target.value, "model")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Model"
          />
          <input
            type="text"
            value={this.state.unit.model_number}
            onChange={event => this.setUnit(event.target.value, "model_number")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Model Number"
          />
          <input
            type="text"
            value={this.state.unit.color}
            onChange={event => this.setUnit(event.target.value, "color")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Color"
          />
          <input
            type="text"
            value={this.state.unit.odometer}
            onChange={event => this.setUnit(event.target.value, "odometer")}
            className="form-input py-1 mb-1 ml-2 w-1/8"
            placeholder="Odometer"
          />
          <div className="form-input py-1 mb-1 ml-2 w-1/8 flex flex-row">
            <button
              className="rounded-full flex h-8 w-8 items-center justify-center text-white bg-blue-800"
              onClick={() =>
                this.setState({
                  show_purchase_info: !this.state.show_purchase_info
                })
              }
            >
              PI
            </button>
            <svg
              onClick={() => this.deleteUnit()}
              className="fill-current text-red-500 h-5 w-5 cursor-pointer ml-6 mt-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
            </svg>
          </div>
        </div>
        {this.state.show_purchase_info && (
          <DealPurchase
            purchaseInfoUpdated={(pi, field) => this.setUnit(pi, field)}
            pi={this.state.unit.purchase_information}
          />
        )}
      </div>
    );
  }
}

export default SingleUnit;
