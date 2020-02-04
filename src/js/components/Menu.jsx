import React from "react";
import { logout, isAdmin } from "../helpers/auth";

class Menu extends React.Component {
  state = {
    open: false
  };

  constructor(props) {
    super(props);

    this.path =
      window.location.pathname === "/" ? "/deals" : window.location.pathname;
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { onLogout } = this.props;

    let icon = "";

    switch (this.path) {
      case "/deals":
        icon = (
          <svg
            style={{
              transform: "translate(55px, 40px) rotate(15deg)"
            }}
            className="h-12 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm1-5h1a3 3 0 0 0 0-6H7.99a1 1 0 0 1 0-2H14V5h-3V3H9v2H8a3 3 0 1 0 0 6h4a1 1 0 1 1 0 2H6v2h3v2h2v-2z" />
          </svg>
        );
        break;
      case "/customers":
        icon = (
          <svg
            style={{
              transform: "translate(55px, 40px) rotate(15deg)"
            }}
            className="h-12 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zM7 6v2a3 3 0 1 0 6 0V6a3 3 0 1 0-6 0zm-3.65 8.44a8 8 0 0 0 13.3 0 15.94 15.94 0 0 0-13.3 0z" />
          </svg>
        );
        break;
      case "/settings":
        icon = (
          <svg
            style={{
              transform: "translate(55px, 40px) rotate(15deg)"
            }}
            className="h-12 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M3.94 6.5L2.22 3.64l1.42-1.42L6.5 3.94c.52-.3 1.1-.54 1.7-.7L9 0h2l.8 3.24c.6.16 1.18.4 1.7.7l2.86-1.72 1.42 1.42-1.72 2.86c.3.52.54 1.1.7 1.7L20 9v2l-3.24.8c-.16.6-.4 1.18-.7 1.7l1.72 2.86-1.42 1.42-2.86-1.72c-.52.3-1.1.54-1.7.7L11 20H9l-.8-3.24c-.6-.16-1.18-.4-1.7-.7l-2.86 1.72-1.42-1.42 1.72-2.86c-.3-.52-.54-1.1-.7-1.7L0 11V9l3.24-.8c.16-.6.4-1.18.7-1.7zM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        );
        break;
      case "/users":
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: "translate(55px, 40px) rotate(15deg)"
            }}
            className="h-12 fill-current text-white"
            viewBox="0 0 20 20"
          >
            <path d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z" />
          </svg>
        );
        break;
      case "/cash-specials":
        icon = (
          <svg
            style={{
              transform: "translate(55px, 40px) rotate(15deg)"
            }}
            className="h-12 fill-current text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M3 6c0-1.1.9-2 2-2h8l4-4h2v16h-2l-4-4H5a2 2 0 0 1-2-2H1V6h2zm8 9v5H8l-1.67-5H5v-2h8v2h-2z" />
          </svg>
        );
        break;
    }

    return (
      <nav className="flex items-center justify-between flex-wrap p-6 lg:pt-0 lg:pb-2 bg-blue-500 lg:bg-white">
        <div className="block lg:hidden">
          <button
            onClick={() => this.toggle()}
            className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-200 hover:text-blue-100 hover:border-blue-100"
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
          <div
            className="hidden lg:inline-block bg-blue-500 mr-10 flex items-center align-center z-10 shadow-md"
            style={{
              width: 170 + "px",
              height: 120 + "px",
              transform: "translate(-35px, -20px) rotate(-15deg)",
              borderRadius: 20 + "px"
            }}
          >
            {icon}
          </div>
          <div className="text-md lg:flex-grow">
            <a
              href="/deals"
              className={
                "nav-item" + (this.path === "/deals" ? "  nav-selected" : "")
              }
            >
              Deals
            </a>
            <a
              href="/customers"
              className={
                "nav-item" +
                (this.path === "/customers" ? "  nav-selected" : "")
              }
            >
              Customers
            </a>
            {isAdmin() && (
              <a
                href="/users"
                className={
                  "nav-item" + (this.path === "/users" ? "  nav-selected" : "")
                }
              >
                Users
              </a>
            )}
            <a
              href="/settings"
              className={
                "nav-item" + (this.path === "/settings" ? " nav-selected" : "")
              }
            >
              Settings
            </a>
            {isAdmin() && (
              <a
                href="/cash-specials"
                className={
                  "nav-item" +
                  (this.path === "/cash-specials" ? " nav-selected" : "")
                }
              >
                Cash Specials
              </a>
            )}
          </div>
          <div>
            <a
              href="#responsive-header"
              onClick={() => {
                logout();
                onLogout();
              }}
              className="nav-item"
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
