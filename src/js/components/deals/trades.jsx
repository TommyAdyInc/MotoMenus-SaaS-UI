import React from "react";
import axios from "axios";
import { apiURL } from "../../helpers/url";
import { getAuthToken } from "../../helpers/auth";
import Modal from "../Modal.jsx";

class DealTrade extends React.Component {
  state = {
    trades: [],
    confirm_delete: null
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

  deleteConfirm(trade) {
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
                    trade: <br />
                    {trade.make} {trade.model}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:px-6 sm:py-4 sm:flex sm:flex-row-reverse">
            <button
              className="text-white bg-green-500 hover:bg-green-700 py-2 px-4 rounded-md"
              onClick={() => this.deleteTrade(trade)}
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
                  onClick={() => this.deleteConfirm(t)}
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

        {this.state.confirm_delete}
      </label>
    );
  }
}

export default DealTrade;
