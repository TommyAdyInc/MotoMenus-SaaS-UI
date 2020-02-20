import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealPurchase extends React.Component {
  state = {
    pi: this.props.pi,
    subtotal: 0,
    sales_tax: 0,
    trade_equity: 0,
    cash_balance: 0
  };

  constructor(props) {
    super(props);
  }

  subtotal() {
    let that = this;
    let tax = 0;

    let subtotal =
      [
        "price",
        "manufacturer_freight",
        "technician_setup",
        "accessories",
        "accessories_labor",
        "labor",
        "riders_edge_course",
        "miscellaneous_costs",
        "document_fee"
      ].reduce((total, field) => {
        let to_add = parseFloat(that.state.pi[field]) || 0;

        if (parseInt(that.state.pi["taxable_" + field])) {
          tax += (to_add * that.state.pi.sales_tax_rate) / 100;
        }

        total += to_add;

        return total;
      }, 0) - (parseFloat(this.state.pi.trade_in_allowance) || 0);

    if (parseInt(this.state.pi.tax_credit_on_trade)) {
      tax -=
        ((parseFloat(this.state.pi.trade_in_allowance) || 0) *
          that.state.pi.sales_tax_rate) /
        100;
    }

    this.setState(
      { sales_tax: tax.toFixed(2), subtotal: subtotal.toFixed(2) },
      this.setTotal
    );
  }

  setTotal() {
    this.setState({
      cash_balance: (
        parseFloat(this.state.subtotal) +
        parseFloat(this.state.sales_tax) +
        (parseFloat(this.state.pi.title_trip_fee) || 0) +
        (parseFloat(this.state.payoff_balance_owed) || 0) -
        (parseFloat(this.state.pi.deposit) || 0)
      ).toFixed(2)
    }, this.totalSet);
  }

  totalSet() {
    this.props.purchaseInfoUpdated(this.state.cash_balance, 'cash_balance');
  }

  setPI(value, field) {
    this.setState(state => {
      let pi = { ...state.pi };
      pi[field] = value;

      return { pi };
    }, this.purchaseInfoUpdated);
  }

  purchaseInfoUpdated() {
    this.props.purchaseInfoUpdated(this.state.pi, 'purchase_information');
    this.subtotal();
  }

  componentDidMount() {
    this.subtotal();
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-full border border-blue-500 rounded-lg p-3">
        <span className="block w-full">
          {" "}
          Purchase Information for above unit
        </span>
        <div className="w-full flex flex-row">
          <div className="border border-gray-500 rounded-lg mr-2 p-2 w-3/4">
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">MSRP</span>
              <input
                type="number"
                value={this.state.pi.msrp}
                onChange={event => this.setPI(event.target.value, "msrp")}
                className="form-input py-1"
                placeholder="MSRP"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Price</span>
              <input
                type="number"
                value={this.state.pi.msrp}
                onChange={event => this.setPI(event.target.value, "price")}
                className="form-input py-1"
                placeholder="Price"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Manufacturer Freight</span>
              <input
                type="number"
                value={this.state.pi.manufacturer_freight}
                onChange={event =>
                  this.setPI(event.target.value, "manufacturer_freight")
                }
                className="form-input py-1"
                placeholder="Manufacturer Freight"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Technician Setup</span>
              <input
                type="number"
                value={this.state.pi.technician_setup}
                onChange={event =>
                  this.setPI(event.target.value, "technician_setup")
                }
                className="form-input py-1"
                placeholder="Technician Setup"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Accessories</span>
              <input
                type="number"
                value={this.state.pi.accessories}
                onChange={event =>
                  this.setPI(event.target.value, "accessories")
                }
                className="form-input py-1"
                placeholder="Accessories"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Accessories Labor</span>
              <input
                type="number"
                value={this.state.pi.accessories_labor}
                onChange={event =>
                  this.setPI(event.target.value, "accessories_labor")
                }
                className="form-input py-1"
                placeholder="Accessories Labor"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Labor</span>
              <input
                type="number"
                value={this.state.pi.labor}
                onChange={event => this.setPI(event.target.value, "labor")}
                className="form-input py-1"
                placeholder="Labor"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">
                Rider&apos;s Edge Course
              </span>
              <input
                type="number"
                value={this.state.pi.riders_edge_course}
                onChange={event =>
                  this.setPI(event.target.value, "riders_edge_course")
                }
                className="form-input py-1"
                placeholder="Rider's Edge Course"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Miscellaneous Costs</span>
              <input
                type="number"
                value={this.state.pi.miscellaneous_costs}
                onChange={event =>
                  this.setPI(event.target.value, "miscellaneous_costs")
                }
                className="form-input py-1"
                placeholder="Miscellaneous Costs"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Trade In Allowance</span>
              <input
                type="number"
                value={this.state.pi.trade_in_allowance}
                onChange={event =>
                  this.setPI(event.target.value, "trade_in_allowance")
                }
                className="form-input py-1"
                placeholder="Trade In Allowance"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">
                Payoff Balance Owed onTrade
              </span>
              <input
                type="number"
                value={this.state.pi.payoff_balance_owed}
                onChange={event =>
                  this.setPI(event.target.value, "payoff_balance_owed")
                }
                className="form-input py-1"
                placeholder="Payoff Balance Owed on Trade"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Title/Trip Fee</span>
              <input
                type="number"
                value={this.state.pi.title_trip_fee}
                onChange={event =>
                  this.setPI(event.target.value, "title_trip_fee")
                }
                className="form-input py-1"
                placeholder="Title/Trip Fee"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Deposit</span>
              <input
                type="number"
                value={this.state.pi.deposit}
                onChange={event => this.setPI(event.target.value, "deposit")}
                className="form-input py-1"
                placeholder="Deposit"
              />
            </label>
            <label className="mb-1 block w-full xl:w-1/2 bg-white even:bg-gray-200">
              <span className="w-1/2 inline-block">Sales Tax Rate</span>
              <input
                type="number"
                value={this.state.pi.sales_tax_rate}
                onChange={event =>
                  this.setPI(event.target.value, "sales_tax_rate")
                }
                className="form-input py-1"
                placeholder="Sales Tax Rate"
              />
            </label>
            <div className="w-full block mt-3">
              <b className="w-3/4 text-right inline-block">Document Fee:</b>
              <span className="inline-block w-1/4 text-right text-default">
                ${this.state.pi.document_fee}
              </span>
              <b className="w-3/4 text-right inline-block">Sub-total:</b>
              <span className="inline-block w-1/4 text-right text-default">
                ${this.state.subtotal}
              </span>
              <b className="w-3/4 text-right inline-block">Sales Tax:</b>
              <span className="inline-block w-1/4 text-right text-default">
                ${this.state.sales_tax}
              </span>
              <b className="w-3/4 text-right inline-block">Trade Equity:</b>
              <span className="inline-block w-1/4 text-right text-default">
                ${this.state.trade_equity}
              </span>
              <b className="w-3/4 text-right inline-block mt-2">
                Cash Balance:
              </b>
              <b className="inline-block w-1/4 text-right text-lg">
                ${this.state.cash_balance}
              </b>
            </div>
          </div>
          <div className="border border-gray-500 rounded-lg w-1/4 p-2">
            <span className="block w-full">Taxables</span>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(event.target.checked ? 1 : 0, "taxable_price")
                }
                defaultChecked={parseInt(this.state.pi.taxable_price)}
              />
              <span>Price</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_manufacturer_freight"
                  )
                }
                defaultChecked={parseInt(
                  this.state.pi.taxable_manufacturer_freight
                )}
              />
              <span>Manufacturer Freight</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_technician_setup"
                  )
                }
                defaultChecked={parseInt(
                  this.state.pi.taxable_technician_setup
                )}
              />
              <span>Technician Setup</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_accessories"
                  )
                }
                defaultChecked={parseInt(this.state.pi.taxable_accessories)}
              />
              <span>Accessories</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_accessories_labor"
                  )
                }
                defaultChecked={parseInt(
                  this.state.pi.taxable_accessories_labor
                )}
              />
              <span>Accessories Labor</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(event.target.checked ? 1 : 0, "taxable_labor")
                }
                defaultChecked={parseInt(this.state.pi.taxable_labor)}
              />
              <span>Labor</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_riders_edge_course"
                  )
                }
                defaultChecked={parseInt(
                  this.state.pi.taxable_riders_edge_course
                )}
              />
              <span>Rider&apos;s Edge Course</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_miscellaneous_costs"
                  )
                }
                defaultChecked={parseInt(
                  this.state.pi.taxable_miscellaneous_costs
                )}
              />
              <span>Miscellaneous Costs</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "taxable_document_fee"
                  )
                }
                defaultChecked={parseInt(this.state.pi.taxable_document_fee)}
              />
              <span>Document Fee</span>
            </label>
            <span className="block w-full mt-5">Other</span>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(event.target.checked ? 1 : 0, "show_msrp_on_pdf")
                }
                defaultChecked={parseInt(this.state.pi.show_msrp_on_pdf)}
              />
              <span>Show MSRP on PDF</span>
            </label>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                onChange={event =>
                  this.setPI(
                    event.target.checked ? 1 : 0,
                    "tax_credit_on_trade"
                  )
                }
                defaultChecked={parseInt(this.state.pi.tax_credit_on_trade)}
              />
              <span>Allow tax credit on trade</span>
            </label>
          </div>
        </div>
      </label>
    );
  }
}

export default DealPurchase;
