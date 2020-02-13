import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealStatus extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    const { deal, steps, setStatus } = this.props;

    let sales_steps = [];

    steps.forEach((s, index) => {
      let bg =
        index < 4
          ? "bg-blue-" + (600 - index * 100)
          : "bg-green-" + (300 + (index - 4) * 100);

      sales_steps.push(
        <div
          key={"l" + index}
          className="flex-grow block bg-gray-300 h-1 mt-6 mx-1 text-xs text-gray-800 text-right pr-1 overflow-y-visible"
          style={{ lineHeight: 3 + "px" }}
        >
          {s}
        </div>
      );

      sales_steps.push(
        <div
          key={index}
          className={
            "rounded-full p-1 " +
            (deal.sales_status === s ? "bg-red-500" : "bg-transparent")
          }
        >
          <div className="rounded-full p-1 bg-white">
            <button
              className={
                "cursor-default rounded-full flex h-8 w-8 items-center justify-center text-white " +
                bg
              }
              onClick={() => setStatus(s)}
            >
              S{index + 1}
            </button>
          </div>
        </div>
      );
    });

    return <div className="w-full flex flex-row p-2">{sales_steps}</div>;
  }
}

export default DealStatus;
