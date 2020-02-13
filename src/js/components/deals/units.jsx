import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealUnit extends React.Component {
  state = {
    units: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let units = this.props.units;

    units.forEach(u => {
      for (let key in u) {
        if (!u.hasOwnProperty(key)) continue;

        if (key === "purchase_information") {
          if (!u["purchase_information"]) {
            u["purchase_information"] = this.blankPurchaseInfo();
          } else {
            for (let pkey in u["purchase_information"]) {
              if (!u["purchase_information"].hasOwnProperty(pkey)) continue;

              if (u["purchase_information"][pkey] === null) {
                u["purchase_information"][pkey] = "";
              }
            }
          }
        } else if (u[key] === null) {
          u[key] = "";
        }
      }
    });

    this.setState({ units });
  }

  addNewUnit() {
    this.setState(state => {
      let units = [...state.units];
      units.push({
        stock_number: "",
        year: "",
        make: "",
        model: "",
        model_number: "",
        color: "",
        odometer: "",
        purchase_information: this.blankPurchaseInfo()
      });

      return { units };
    }, this.unitAddedUpdated);
  }

  blankPurchaseInfo() {
    return {
      msrp: "",
      price: "",
      manufacturer_freight: "",
      technician_setup: "",
      accessories: "",
      accessories_labor: "",
      labor: "",
      riders_edge_course: "",
      miscellaneous_costs: "",
      document_fee: "249.00", // TODO: set from pulled in API value
      trade_in_allowance: "",
      sales_tax_rate: "6.225", // TODO: set from pulled in API value
      payoff_balance_owed: "",
      title_trip_fee: "",
      deposit: "",
      taxable_show_msrp_on_pdf: 0,
      taxable_price: 1,
      taxable_manufacturer_freight: 1,
      taxable_technician_setup: 1,
      taxable_accessories: 1,
      taxable_accessories_labor: 1,
      taxable_labor: 1,
      taxable_riders_edge_course: 1,
      taxable_miscellaneous_costs: 0,
      taxable_document_fee: 0,
      tax_credit_on_trade: 0
    };
  }

  setUnit(value, field, index) {
    this.setState(state => {
      let units = [...state.units];

      let unit = { ...units[index] };
      unit[field] = value;
      units[index] = unit;

      return { units };
    }, this.unitAddedUpdated);
  }

  deleteUnit(index) {
    const { ui, api } = this.props;

    if (this.state.units[index].id) {
      axios({
        method: "DELETE",
        url:
          apiURL(api, ui) +
          "/units/" +
          this.state.units[index].deal_id +
          "/" +
          this.state.units[index].id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(() => this.removeFromState(index))
        .catch(errors => console.log(errors));
    } else {
      this.removeFromState(index);
    }
  }

  removeFromState(index) {
    this.setState(state => {
      let units = [...state.units];

      units.splice(index, 1);

      return { units };
    }, this.unitAddedUpdated);
  }

  unitAddedUpdated() {
    this.props.unitUpdated(this.state.units);
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-full pr-3">
        <span className="block w-full">Unit Info</span>
        <div className="flex flex-row w-full">
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Stock Number
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Year
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Make
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Model
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Model Number
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Color
          </span>
          <span className="form-input border-none ml-2 text-sm py-1 mb-1 w-1/8">
            Odometer
          </span>
        </div>
        {this.state.units.map((u, index) => {
          return (
            <div key={index} className="flex flex-row">
              <input
                type="text"
                value={this.state.units[index].stock_number}
                onChange={event =>
                  this.setUnit(event.target.value, "stock_number", index)
                }
                className="form-input py-1 mb-1 w-1/8"
                placeholder="Stock Number"
              />
              <input
                type="text"
                value={this.state.units[index].year}
                onChange={event =>
                  this.setUnit(event.target.value, "year", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Year"
              />
              <input
                type="text"
                value={this.state.units[index].make}
                onChange={event =>
                  this.setUnit(event.target.value, "make", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Make"
              />
              <input
                type="text"
                value={this.state.units[index].model}
                onChange={event =>
                  this.setUnit(event.target.value, "model", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Model"
              />
              <input
                type="text"
                value={this.state.units[index].model_number}
                onChange={event =>
                  this.setUnit(event.target.value, "model_number", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Model Number"
              />
              <input
                type="text"
                value={this.state.units[index].color}
                onChange={event =>
                  this.setUnit(event.target.value, "color", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Color"
              />
              <input
                type="text"
                value={this.state.units[index].odometer}
                onChange={event =>
                  this.setUnit(event.target.value, "odometer", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Odometer"
              />
              <div className="form-input py-1 mb-1 ml-2 w-1/8 flex flex-row">
                <button className="rounded-full flex h-8 w-8 items-center justify-center text-white bg-blue-800">
                  PI
                </button>
                <svg
                  onClick={() => this.deleteUnit(index)}
                  className="fill-current text-red-500 h-5 w-5 cursor-pointer ml-6 mt-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z" />
                </svg>
              </div>
            </div>
          );
        })}
        <div className="w-full text-right">
          <button
            className="bg-orange-400 text-white rounded-full px-4 text-sm py-1 mt-2 hover:bg-orange-600"
            onClick={() => this.addNewUnit()}
          >
            New Unit
          </button>
        </div>
      </label>
    );
  }
}

export default DealUnit;
