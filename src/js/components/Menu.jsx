import React from "react";
import { logout } from "../helpers/auth";

class Menu extends React.Component {
  state = {
    open: false
  };

  constructor(props) {
    super(props);
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { onLogout } = this.props;

    return (
      <nav className="flex items-center justify-between flex-wrap bg-blue-400 p-6">
        <div className="block lg:hidden">
          <button
            onClick={() => this.toggle()}
            className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          className={
            (this.state.open ? "block" : "hidden") +
            " w-full flex-grow lg:flex lg:items-center lg:w-auto"
          }
        >
          <div className="text-sm lg:flex-grow">
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
            >
              Docs
            </a>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"
            >
              Examples
            </a>
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white"
            >
              Blog
            </a>
          </div>
          <div>
            <a
              href="#responsive-header"
              onClick={() => {
                logout();
                onLogout();
              }}
              className="block lg:inline-block mt-4 lg:mt-0 hover:text-white text-blue-200 text-sm"
            >
              Logout
            </a>
          </div>
        </div>
      </nav>
    );
  }
}

export default Menu;
