import React from "react";
import { createPortal } from "react-dom";

const portal_root = document.getElementById("portal-root");

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    portal_root.appendChild(this.el);
  }

  componentWillUnmount() {
    portal_root.removeChild(this.el);
  }

  render() {
    return createPortal(this.props.children, this.el);
  }
}

export default Portal;
