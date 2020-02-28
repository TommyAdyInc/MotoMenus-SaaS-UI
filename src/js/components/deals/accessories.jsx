import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealAccessories extends React.Component {
  state = {
    accessories: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    unit: 0
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let accessories = this.props.accessories.length
      ? this.props.accessories
      : [
          {
            part_number: "",
            item_name: "",
            description: "",
            quantity: "",
            msrp: "",
            unit_price: "",
            labor: ""
          }
        ];

    accessories.forEach(a => {
      for (let key in a) {
        if (!a.hasOwnProperty(key)) continue;

        if (a[key] === null) {
          a[key] = "";
        }
      }
    });

    this.setState({ accessories }, this.setTotals);
  }

  subtotal() {
    return this.state.accessories.reduce((total, a) => {
      total += (parseFloat(a.unit_price) || 0) * (parseInt(a.quantity) || 1);

      return total;
    }, 0);
  }

  labor() {
    return this.state.accessories.reduce((total, a) => {
      total += parseFloat(a.labor) || 0;

      return total;
    }, 0);
  }

  setTotals() {
    let total = 0;

    this.state.accessories.forEach(a => {
      total +=
        (parseFloat(a.unit_price) || 0) * (parseInt(a.quantity) || 1) +
        (parseFloat(a.labor) || 0);
    });

    let tax = (total * this.props.tax_rate) / 100;

    this.setState({
      subtotal: total.toFixed(2),
      tax: tax.toFixed(2),
      total: (total + tax).toFixed(2)
    });
  }

  addNewAccessory() {
    this.setState(state => {
      let accessories = [...state.accessories];
      accessories.push({
        part_number: "",
        item_name: "",
        description: "",
        quantity: "",
        msrp: "",
        unit_price: "",
        labor: ""
      });

      return { accessories };
    }, this.accessoriesAddedUpdated);
  }

  setAccessory(value, field, index) {
    this.setState(state => {
      let accessories = [...state.accessories];

      if (field) {
        let accessory = { ...accessories[index] };
        accessory[field] = value;
        accessories[index] = accessory;
      } else {
        accessories[index] = value;
      }

      return { accessories };
    }, this.accessoriesAddedUpdated);
  }

  removeFromState(accessory) {
    let index = this.state.accessories.indexOf(accessory);
    this.setState(state => {
      let accessories = [...state.accessories];

      accessories.splice(index, 1);

      return { accessories };
    }, this.accessoriesAddedUpdated);
  }

  deleteAccessory(accessory) {
    const { ui, api } = this.props;

    if (accessory.id) {
      axios({
        method: "DELETE",
        url:
          apiURL(api, ui) +
          "/accessories/" +
          accessory.deal_id +
          "/" +
          accessory.id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(() => this.removeFromState(accessory))
        .catch(errors => console.log(errors));
    } else {
      this.removeFromState(accessory);
    }
  }

  accessoriesAddedUpdated() {
    this.props.accessoriesUpdated(this.state.accessories);
    this.setTotals();
  }

  transferToPi() {
    let units = [...this.props.units];
    let unit = { ...units[this.state.unit] };
    let pi = { ...unit.purchase_information };

    pi.accessories = this.subtotal();
    pi.accessories_labor = this.labor();

    unit.purchase_information = pi;
    units[this.state.unit] = unit;

    this.props.unitUpdated(units);
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-full border border-blue-500 rounded-lg p-3">
        <div className="block w-full text-lg mb-2">
          Accessories
          <div className="inline-block float-right text-right">
            <button
              className="bg-indigo-400 text-white rounded-full px-4 text-sm py-1 mr-2 hover:bg-indigo-600"
              onClick={() => this.transferToPi()}
            >
              Transfer to PI
            </button>
            {this.props.units.length > 1 && (
              <select
                className="form-select py-1"
                onChange={e => this.setState({ unit: e.target.value })}
              >
                {this.props.units.map(function(u, index) {
                  return (
                    <option key={index} value={index}>
                      Unit {index + 1}
                    </option>
                  );
                })}
              </select>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full">
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Part Number
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Item Name
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Description
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Quantity
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            MSRP
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Unit Price
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Labor
          </span>
        </div>
        {this.state.accessories.map((a, index) => {
          return (
            <div className="flex flex-row w-full block" key={index}>
              <input
                type="text"
                value={this.state.accessories[index].part_number}
                onChange={event =>
                  this.setAccessory(event.target.value, "part_number", index)
                }
                className="form-input py-1 mb-1 w-1/8"
                placeholder="Part Number"
              />
              <input
                type="text"
                value={this.state.accessories[index].item_name}
                onChange={event =>
                  this.setAccessory(event.target.value, "item_name", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Item Name"
              />
              <input
                type="text"
                value={this.state.accessories[index].description}
                onChange={event =>
                  this.setAccessory(event.target.value, "description", index)
                }
                className="form-textarea py-1 mb-1 ml-2 w-1/8"
                placeholder="Description"
              />
              <input
                type="number"
                value={this.state.accessories[index].quantity}
                onChange={event =>
                  this.setAccessory(event.target.value, "quantity", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Quantity"
                step={1}
                min={1}
              />
              <input
                type="number"
                value={this.state.accessories[index].msrp}
                onChange={event =>
                  this.setAccessory(event.target.value, "msrp", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="MSRP"
              />
              <input
                type="number"
                value={this.state.accessories[index].unit_price}
                onChange={event =>
                  this.setAccessory(event.target.value, "unit_price", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Unit Price"
              />
              <input
                type="number"
                value={this.state.accessories[index].labor}
                onChange={event =>
                  this.setAccessory(event.target.value, "labor", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/8"
                placeholder="Labor"
              />
              <div className="form-input py-1 mb-1 ml-2 w-1/8 flex flex-row">
                <svg
                  onClick={() => this.deleteAccessory(a)}
                  className="fill-current text-red-500 h-5 w-5 cursor-pointer mt-1"
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
            onClick={() => this.addNewAccessory()}
          >
            New Accessory
          </button>
        </div>
        <div className="w-full block mt-3">
          <b className="w-3/4 text-right inline-block">Sub-total:</b>
          <span className="inline-block w-1/4 text-right text-default">
            ${this.state.subtotal}
          </span>
          <b className="w-3/4 text-right inline-block">Sales Tax:</b>
          <span className="inline-block w-1/4 text-right text-default">
            ${this.state.tax}
          </span>
          <b className="w-3/4 text-right inline-block mt-2">
            Accessories Total:
          </b>
          <b className="inline-block w-1/4 text-right text-lg">
            ${this.state.total}
          </b>
        </div>
      </label>
    );
  }
}

export default DealAccessories;
