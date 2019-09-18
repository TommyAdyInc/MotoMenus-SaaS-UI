import React from "react";

import Modal from "./Modal.jsx";

const NotFound = () => (
  <Modal>
    <div className="bg-white inline-flex items-center leading-none p-2 rounded-full shadow text-red-600">
      <span className="bg-red-600 h-6 items-center inline-flex justify-center px-3 rounded-full text-white">
        Error!
      </span>
      <span className="inline-flex px-2">
        <div>404 Not Found.</div>
        <div className="ml-1">
          The React router was unable to match the specified path to a component
          so the &lt;NotFound&gt; component was loaded.
        </div>
      </span>
    </div>
  </Modal>
);

export default NotFound;
