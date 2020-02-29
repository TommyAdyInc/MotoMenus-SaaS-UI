import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealPurchase extends React.Component {
  state = {
    pi: {
      msrp: "",
      price: "",
      manufacturer_freight: "",
      technician_setup: "",
      accessories: "",
      accessories_labor: "",
      labor: "",
      riders_edge_course: "",
      miscellaneous_costs: "",
      document_fee: 0,
      trade_in_allowance: "",
      sales_tax_rate: 0,
      payoff_balance_owed: "",
      title_trip_fee: "",
      deposit: "",
      show_msrp_on_pdf: 0,
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
    },
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
    this.setState(
      {
        cash_balance: (
          parseFloat(this.state.subtotal) +
          parseFloat(this.state.sales_tax) +
          (parseFloat(this.state.pi.title_trip_fee) || 0) +
          (parseFloat(this.state.payoff_balance_owed) || 0) -
          (parseFloat(this.state.pi.deposit) || 0)
        ).toFixed(2)
      },
      this.totalSet
    );
  }

  totalSet() {
    if (this.state.pi.price) {
      this.props.purchaseInfoUpdated(this.state.cash_balance, "cash_balance");
    }
  }

  setPI(value, field) {
    this.setState(state => {
      let pi = { ...state.pi };
      pi[field] = value;

      return { pi };
    }, this.purchaseInfoUpdated);
  }

  purchaseInfoUpdated() {
    this.props.purchaseInfoUpdated(this.state.pi, "purchase_information");
    this.subtotal();
  }

  componentDidMount() {
    if (this.props.pi) {
      this.setState({ pi: this.props.pi }, this.subtotal);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.pi && prevProps.pi !== this.props.pi) {
      this.setState({ pi: this.props.pi }, this.subtotal);
    } else if (!this.props.pi) {
      this.setState(
        {
          pi: {
            msrp: "",
            price: "",
            manufacturer_freight: "",
            technician_setup: "",
            accessories: "",
            accessories_labor: "",
            labor: "",
            riders_edge_course: "",
            miscellaneous_costs: "",
            document_fee: this.props.document_fee,
            trade_in_allowance: "",
            sales_tax_rate: this.props.tax_rate,
            payoff_balance_owed: "",
            title_trip_fee: "",
            deposit: "",
            show_msrp_on_pdf: 0,
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
          }
        },
        this.subtotal
      );
    }
  }

  render() {
    return (
      <label
        className="text-gray-700 text-sm font-bold mb-2 w-full border border-blue-500 rounded-lg p-3"
        style={{ display: this.props.show ? "block" : "none" }}
      >
        <span className="block w-full">
          {" "}
          Purchase Information for above unit
        </span>
        <div className="w-full flex flex-row">
          <div className="border border-gray-300 rounded-lg mr-2 p-2 w-3/4">
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">MSRP</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.msrp}
                  onChange={event => this.setPI(event.target.value, "msrp")}
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 py-1"
                  placeholder="MSRP"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Price</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.price}
                  onChange={event => this.setPI(event.target.value, "price")}
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Price"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">
                Manufacturer Freight
              </span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.manufacturer_freight}
                  onChange={event =>
                    this.setPI(event.target.value, "manufacturer_freight")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Manufacturer Freight"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Technician Setup</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.technician_setup}
                  onChange={event =>
                    this.setPI(event.target.value, "technician_setup")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Technician Setup"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Accessories</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.accessories}
                  onChange={event =>
                    this.setPI(event.target.value, "accessories")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Accessories"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Accessories Labor</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.accessories_labor}
                  onChange={event =>
                    this.setPI(event.target.value, "accessories_labor")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Accessories Labor"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Labor</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.labor}
                  onChange={event => this.setPI(event.target.value, "labor")}
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Labor"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">
                Rider&apos;s Edge Course
              </span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.riders_edge_course}
                  onChange={event =>
                    this.setPI(event.target.value, "riders_edge_course")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Rider's Edge Course"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">
                Miscellaneous Costs
              </span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.miscellaneous_costs}
                  onChange={event =>
                    this.setPI(event.target.value, "miscellaneous_costs")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Miscellaneous Costs"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">
                Trade In Allowance
              </span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.trade_in_allowance}
                  onChange={event =>
                    this.setPI(event.target.value, "trade_in_allowance")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Trade In Allowance"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">
                Payoff Balance Owed onTrade
              </span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.payoff_balance_owed}
                  onChange={event =>
                    this.setPI(event.target.value, "payoff_balance_owed")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Payoff Balance Owed on Trade"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Title/Trip Fee</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.title_trip_fee}
                  onChange={event =>
                    this.setPI(event.target.value, "title_trip_fee")
                  }
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Title/Trip Fee"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Deposit</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    $
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.deposit}
                  onChange={event => this.setPI(event.target.value, "deposit")}
                  className="form-input block w-full pl-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Deposit"
                />
              </div>
            </label>
            <label className="flex flex-row mb-1 block w-full bg-white even:bg-gray-100">
              <span className="w-1/2 inline-block pt-2">Sales Tax Rate</span>
              <div className="mt-1 relative inline-block rounded-md shadow-sm w-1/2">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">
                    %
                  </span>
                </div>
                <input
                  type="number"
                  value={this.state.pi.sales_tax_rate}
                  onChange={event =>
                    this.setPI(event.target.value, "sales_tax_rate")
                  }
                  className="form-input block w-full pr-7 sm:text-sm sm:leading-5 w-1/2 py-1"
                  placeholder="Sales Tax Rate"
                />
              </div>
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
          <div className="border border-gray-300 rounded-lg w-1/4 p-2">
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
