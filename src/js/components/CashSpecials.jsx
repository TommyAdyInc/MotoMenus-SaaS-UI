import React from "react";
import axios from "axios";
import {
  isAuthenticated,
  sessionExpired,
  logout,
  getAuthToken,
  isAdmin
} from "../helpers/auth";
import { apiURL } from "../helpers/url";
import { Redirect } from "@reach/router";
import Modal from "./Modal.jsx";
import Loading from "../helpers/Loading.jsx";

class CashSpecials extends React.Component {
  state = {
    cash_specials: [],
    loading: false,
    error: null,
    save_specials: false
  };

  constructor(props) {
    super(props);
  }

  getCashSpecials() {
    if (isAdmin()) {
      this.checkSession();

      const { api, ui } = this.props;

      this.setState({ loading: true });

      axios({
        method: "GET",
        url: apiURL(api, ui) + "/cash-specials",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + getAuthToken()
        }
      })
        .then(({ data }) => this.setState({ cash_specials: data }))
        .catch(errors => {
          let error = (
            <Modal>
              <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
                <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
                  Error!
                </span>
                <span className="inline-flex px-2">
                  <div>Could not retrieve cash specials.</div>
                </span>
                <button
                  className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full"
                  onClick={() => this.setState({ error: null })}
                >
                  Close
                </button>
              </div>
            </Modal>
          );

          this.setState({ error });
        })
        .finally(() => this.setState({ loading: false }));
    }
  }

  saveCashSpecials() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "PUT",
      url: apiURL(api, ui) + "/cash-specials",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      },
      data: {
        cash_specials: this.state.cash_specials
      }
    })
      .then(({ data }) => {
        this.setState({ save_specials: true });
        setTimeout(() => this.setState({ save_specials: false }), 4000);
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  viewCashSpecials() {
    const { api, ui } = this.props;

    this.setState({ loading: true });

    axios({
      method: "GET",
      url: apiURL(api, ui) + "/pdf/cash-special",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + getAuthToken()
      }
    })
      .then(({ data }) => {
        const downloadLink = document.createElement("a");
        downloadLink.href = "data:application/pdf;base64," + data;
        downloadLink.download = "CashSpecials.pdf";
        downloadLink.click();
        downloadLink.remove();
      })
      .catch(error => console.log(error))
      .finally(() => this.setState({ loading: false }));
  }

  checkSession() {
    if (sessionExpired()) {
      logout();
    }
  }

  componentDidMount() {
    if (isAuthenticated()) {
      this.getCashSpecials();
    }
  }

  setSpecial(field, value, index) {
    let fields = field.split(".");

    this.setState(state => {
      let cash_specials = [...state.cash_specials];

      let columns = [...cash_specials[index[0]].columns];

      if (fields[1] === "enabled") {
        columns[index[1]].enabled = value;
        cash_specials[index[0]].columns = columns;
      }

      if (fields[1] === "rows") {
        let rows = [...columns[index[1]].rows];
        rows[index[2]][fields[2]] = value;
        columns[index[1]].rows = rows;
        cash_specials[index[0]].columns = columns;
      }

      return { cash_specials };
    });
  }

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    this.checkSession();

    return (
      <div className="px-4 py-1 w-full h-full flex-grow">
        {this.state.loading && <Loading />}

        {this.state.save_specials && (
          <div className="w-full p-5 mb-5 bg-green-200 text-green-700 text-md rounded-lg">
            <b>Success.</b> Cash Specials have been updated.
          </div>
        )}

        <div className="w-full flex flex-wrap flex-grow flex-row justify-start">
          {this.state.cash_specials.map((c, index) => {
            return (
              <div
                className="mb-5 rounded-lg border-blue-500 border p-0 mr-10"
                key={index}
              >
                <h2 className="px-5 py-2 bg-blue-500 text-white">{c.name}</h2>
                <table className="text-gray-900 table-responsive">
                  <thead>
                    <tr>
                      {!!c.row_names[0].name && (
                        <th className="cash-specials-th">&nbsp;</th>
                      )}
                      {c.columns.map((column, i) => {
                        return (
                          <th key={i} className="cash-specials-th">
                            {!!column.name && (
                              <label className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  onChange={event =>
                                    this.setSpecial(
                                      "columns.enabled",
                                      event.target.checked ? 1 : 0,
                                      [index, i]
                                    )
                                  }
                                  defaultChecked={
                                    this.state.cash_specials[index].columns[i]
                                      .enabled
                                  }
                                  className="form-checkbox"
                                />
                                <span className="ml-2">{column.name}</span>
                              </label>
                            )}
                            <span className="block"> MSRP - Discount</span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {c.row_names.map((row, row_index) => {
                      return (
                        <tr
                          key={row_index}
                          className="odd:bg-white even:bg-gray-200"
                        >
                          {!!c.row_names[0].name && (
                            <td className="cash-specials-th">{row.name}</td>
                          )}
                          {c.columns.map((column, i) => {
                            return (
                              <td key={i} className="cash-specials-th">
                                <label className="inline-flex items-center">
                                  <span>$</span>
                                  <input
                                    type="number"
                                    className="form-input w-2/5 p-2"
                                    value={
                                      this.state.cash_specials[index].columns[i]
                                        .rows[row_index].msrp
                                    }
                                    onChange={event =>
                                      this.setSpecial(
                                        "columns.rows.msrp",
                                        event.target.value,
                                        [index, i, row_index]
                                      )
                                    }
                                  />
                                  <span className="ml-2"> - $</span>
                                  <input
                                    type="number"
                                    className="form-input w-2/5 p-2"
                                    value={
                                      this.state.cash_specials[index].columns[i]
                                        .rows[row_index].discount
                                    }
                                    onChange={event =>
                                      this.setSpecial(
                                        "columns.rows.discount",
                                        event.target.value,
                                        [index, i, row_index]
                                      )
                                    }
                                  />
                                </label>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
          <div className="w-full text-right py-5">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-full text-sm"
              onClick={() => this.saveCashSpecials()}
            >
              Save
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white py-1 px-4 rounded-full text-sm ml-6"
              onClick={() => this.viewCashSpecials()}
            >
              Download PDF
            </button>
          </div>
        </div>

        {this.state.error}
      </div>
    );
  }
}

export default CashSpecials;
