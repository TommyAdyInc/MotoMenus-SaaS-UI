import React from "react";
import axios from "axios";
import { getAuthToken } from "../../helpers/auth";
import { apiURL } from "../../helpers/url";
import { STATES } from "../../helpers/states";
import Modal from "../Modal.jsx";
import Loading from "../../helpers/Loading.jsx";

class DealAccessories extends React.Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mb-5 rounded-lg border-blue-500 border p-0 mr-10">
        <h2 className="px-5 py-2 bg-blue-500 text-white">Accessories</h2>
      </div>
    );
  }
}

export default DealAccessories;
