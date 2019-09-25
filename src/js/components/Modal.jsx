import React from "react";
import Portal from "./Portal.jsx";

class Modal extends React.Component {
  render() {
    return (
      <Portal>
        <dialog className="bg-smoke-700 fixed flex h-screen inset-0 items-center justify-center overflow-auto w-full z-50">
          {this.props.children}
        </dialog>
      </Portal>
    );
  }
}

export default Modal;
