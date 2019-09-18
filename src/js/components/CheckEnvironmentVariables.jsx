import React from "react";

import Modal from "./Modal.jsx";

class CheckEnvironmentVariables extends React.Component {
  render() {
    const env_var_name = "API_PORT";
    if (!process.env.API_PORT) {
      return (
        <Modal>
          <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
            <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
              Error!
            </span>
            <span className="inline-flex px-2">
              <div>Missing Environment Variable.</div>
              <code className="mx-1">{env_var_name}</code> is not defined.
            </span>
          </div>
        </Modal>
      );
    }
    return null;
  }
}

export default CheckEnvironmentVariables;
