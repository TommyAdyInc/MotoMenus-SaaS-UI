import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import DealPurchase from "./purchase.jsx";
import Modal from "../Modal.jsx";

class SingleUnit extends React.Component {
  state = {
    show_purchase_info: false,
    unit: {
      stock_number: "",
      year: "",
      make: "",
      model: "",
      model_number: "",
      color: "",
      odometer: "",
      purchase_information: null
    },
    confirm_delete: null
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

  deleteConfirm() {
    let confirm_delete = (
      <Modal>
        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-red-600"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirm Delete
                </h3>
                <div className="mt-2">
                  <p className="text-sm leading-5 text-gray-500">
                    Are you sure you want to completely remove the selected
                    unit: <br />
                    {this.state.unit.make} {this.state.unit.model}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
            <button
              className="text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded-md"
              onClick={() => this.deleteUnit()}
            >
              Confirm
            </button>
            <button
              className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-md mr-6"
              onClick={() => this.setState({ confirm_delete: null })}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );

    this.setState({ confirm_delete });
  }

  deleteUnit() {
    const { ui, api } = this.props;
    this.setState({ confirm_delete: null });
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

  componentDidMount() {
    if (this.props.unit) {
      this.setState({ unit: this.props.unit });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.unit && prevProps.unit !== this.props.unit) {
      this.setState({ unit: this.props.unit });
    } else if (!this.props.unit) {
      this.setState({
        unit: {
          stock_number: "",
          year: "",
          make: "",
          model: "",
          model_number: "",
          color: "",
          odometer: "",
          purchase_information: null
        }
      });
    }
  }

  render() {
    const { tax_rate, document_fee } = this.props;

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
              className="rounded-full flex h-8 w-8 items-center justify-center text-white bg-indigo-600"
              onClick={() =>
                this.setState({
                  show_purchase_info: !this.state.show_purchase_info
                })
              }
            >
              PI
            </button>
            <svg
              onClick={() =>
                this.state.unit.id ? this.deleteConfirm() : this.deleteUnit()
              }
              className="fill-current text-red-500 h-5 w-5 cursor-pointer ml-6 mt-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
            </svg>
          </div>
        </div>
        <DealPurchase
          show={this.state.show_purchase_info}
          purchaseInfoUpdated={(pi, field) => this.setUnit(pi, field)}
          pi={this.state.unit.purchase_information}
          tax_rate={tax_rate}
          document_fee={document_fee}
        />

        {this.state.confirm_delete}
      </div>
    );
  }
}

export default SingleUnit;
