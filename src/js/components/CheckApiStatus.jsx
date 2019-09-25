import axios from "axios";
import React from "react";

import Modal from "./Modal.jsx";

class CheckApiStatus extends React.Component {
  state = {
    element_to_render: null
  };

  async componentDidMount() {
    const { api, ui } = this.props;
    const url =
      "//" +
      ui.subdomain +
      "." +
      api.subdomain +
      "." +
      ui.domain +
      "." +
      ui.tld +
      ":" +
      api.port +
      api.route_prefix +
      api.healthcheck_route;
    console.log(url);
    try {
      await axios.head(url);
    } catch (error) {
      this.handleError(error, url);
    }
  }

  handleError = (error, url) => {
    let error_message = "";
    if (error.response) {
      error_message =
        "A request was sent to the API (" +
        url +
        ") and the server responded with a status code (" +
        error.response.status +
        ") which falls out of the range of 2xx.";
    } else if (error.request) {
      error_message =
        "A request was sent to the API (" +
        url +
        ") but no response was received. The API may not be running.";
    } else {
      error_message =
        "Something happened in setting up the request that triggered an error. " +
        error.message;
    }
    let element_to_render = (
      <Modal>
        <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
          <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
            Error!
          </span>
          <span className="inline-flex px-2">
            <div>{error_message}</div>
          </span>
        </div>
      </Modal>
    );
    this.setState({ element_to_render: element_to_render });
  };

  render() {
    return this.state.element_to_render;
  }
}

export default CheckApiStatus;
