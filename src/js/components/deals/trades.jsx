import React from "react";
import axios from "axios";
import { apiURL } from "../../helpers/url";
import { getAuthToken } from "../../helpers/auth";

class DealTrade extends React.Component {
  state = {
    trades: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let trades = this.props.trades.length
      ? this.props.trades
      : [
          {
            vin: "",
            year: "",
            make: "",
            model: "",
            model_number: "",
            color: "",
            odometer: "",
            book_value: "",
            trade_in_value: ""
          }
        ];

    trades.forEach(t => {
      for (let key in t) {
        if (!t.hasOwnProperty(key)) continue;

        if (t[key] === null) {
          t[key] = "";
        }
      }
    });

    this.setState({ trades });
  }

  addNewTrade() {
    this.setState(state => {
      let trades = [...state.trades];
      trades.push({
        vin: "",
        year: "",
        make: "",
        model: "",
        model_number: "",
        color: "",
        odometer: "",
        book_value: "",
        trade_in_value: ""
      });

      return { trades };
    }, this.tradeAddedUpdated);
  }

  setTrade(value, field, index) {
    this.setState(state => {
      let trades = [...state.trades];

      if (field) {
        let trade = { ...trades[index] };
        trade[field] = value;
        trades[index] = trade;
      } else {
        trades[index] = value;
      }

      return { trades };
    }, this.tradeAddedUpdated);
  }

  removeFromState(trade) {
    let index = this.state.trades.indexOf(trade);
    this.setState(state => {
      let trades = [...state.trades];

      trades.splice(index, 1);

      return { trades };
    }, this.tradeAddedUpdated);
  }

  deleteTrade(trade) {
    const { ui, api } = this.props;

    if (trade.id) {
      axios({
        method: "DELETE",
        url: apiURL(api, ui) + "/trades/" + trade.deal_id + "/" + trade.id,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(() => this.removeFromState(trade))
        .catch(errors => console.log(errors));
    } else {
      this.removeFromState(trade);
    }
  }

  tradeAddedUpdated() {
    this.props.tradeUpdated(this.state.trades);
  }

  render() {
    return (
      <label className="block text-gray-700 text-sm font-bold mb-2 w-full border border-blue-500 rounded-lg p-3">
        <span className="block w-full text-lg mb-2">Trade Info</span>
        <div className="flex flex-row w-full">
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            VIN
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Year
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Make
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Model
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Model Number
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Color
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Odometer
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Book Value
          </span>
          <span className="form-input border-none text-sm py-1 mb-1 w-1/10">
            Trade-in Value
          </span>
        </div>
        {this.state.trades.map((t, index) => {
          return (
            <div className="flex flex-row w-full block" key={index}>
              <input
                type="text"
                value={this.state.trades[index].vin}
                onChange={event =>
                  this.setTrade(event.target.value, "vin", index)
                }
                className="form-input py-1 mb-1 w-1/10"
                placeholder="VIN"
              />
              <input
                type="text"
                value={this.state.trades[index].year}
                onChange={event =>
                  this.setTrade(event.target.value, "year", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Year"
              />
              <input
                type="text"
                value={this.state.trades[index].make}
                onChange={event =>
                  this.setTrade(event.target.value, "make", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Make"
              />
              <input
                type="text"
                value={this.state.trades[index].model}
                onChange={event =>
                  this.setTrade(event.target.value, "model", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Model"
              />
              <input
                type="text"
                value={this.state.trades[index].model_number}
                onChange={event =>
                  this.setTrade(event.target.value, "model_number", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Model Number"
              />
              <input
                type="text"
                value={this.state.trades[index].color}
                onChange={event =>
                  this.setTrade(event.target.value, "color", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Color"
              />
              <input
                type="text"
                value={this.state.trades[index].odometer}
                onChange={event =>
                  this.setTrade(event.target.value, "odometer", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Odometer"
              />
              <input
                type="text"
                value={this.state.trades[index].book_value}
                onChange={event =>
                  this.setTrade(event.target.value, "book_value", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Book Value"
              />
              <input
                type="text"
                value={this.state.trades[index].trade_in_value}
                onChange={event =>
                  this.setTrade(event.target.value, "trade_in_value", index)
                }
                className="form-input py-1 mb-1 ml-2 w-1/10"
                placeholder="Trade-in Value"
              />
              <div className="form-input py-1 mb-1 ml-2 w-1/10 flex flex-row">
                <svg
                  onClick={() => this.deleteTrade(t)}
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
            onClick={() => this.addNewTrade()}
          >
            New Trade
          </button>
        </div>
      </label>
    );
  }
}

export default DealTrade;
