import React from "react";
import SingleUnit from "./unit.jsx";

class DealUnit extends React.Component {
  state = {
    units: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let units = this.props.units.length
      ? this.props.units
      : [
          {
            stock_number: "",
            year: "",
            make: "",
            model: "",
            model_number: "",
            color: "",
            odometer: "",
            purchase_information: this.blankPurchaseInfo()
          }
        ];

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
    };
  }

  setUnit(value, field, index) {
    this.setState(state => {
      let units = [...state.units];

      if (field) {
        let unit = { ...units[index] };
        unit[field] = value;
        units[index] = unit;
      } else {
        units[index] = value;
      }

      return { units };
    }, this.unitAddedUpdated);
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
    const { ui, api } = this.props;
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-full border border-blue-500 rounded-lg p-3">
        <span className="block w-full text-lg mb-2">Unit Info</span>
        <div className="flex flex-row w-full">
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Stock Number
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Year
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Make
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Model
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Model Number
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Color
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/8">
            Odometer
          </span>
        </div>
        {this.state.units.map((u, index) => {
          return (
            <SingleUnit
              ui={ui}
              api={api}
              key={index}
              unit={u}
              removeFromState={() => this.removeFromState(index)}
              unitUpdated={unit => this.setUnit(unit, false, index)}
            />
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
