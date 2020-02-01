import "../../sass/utilities/spinner.scss";

import React from "react";

class Loading extends React.Component {
  render() {
    return (
      <div className="lds-roller z-20">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    );
  }
}

export default Loading;
