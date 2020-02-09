// Assets
import "../sass/tailwind-source.scss";
import "../../node_modules/animate.css/animate.css";

// Community Contributed Modules
import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";

// React Components
import CheckApiStatus from "./components/CheckApiStatus.jsx";
import CheckEnvironmentVariables from "./components/CheckEnvironmentVariables.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import Menu from "./components/Menu.jsx";
import NotFound from "./components/NotFound.jsx";
import Deals from "./components/Deals.jsx";
import Customers from "./components/Customers.jsx";
import { isAuthenticated } from "./helpers/auth";
import Users from "./components/Users.jsx";
import Settings from "./components/Settings.jsx";
import CashSpecials from "./components/CashSpecials.jsx";

class Entry extends React.Component {
  constructor(props) {
    super(props);
    var loc = window.location;
    // console.log("loc", loc);
    var hostname_parts_reversed = loc.hostname.split(".").reverse();
    this.state = {
      api: {
        healthcheck_route: process.env.API_HEALTHCHECK_ROUTE,
        port: process.env.API_PORT,
        route_prefix: process.env.API_ROUTE_PREFIX,
        oauth_secret: process.env.OAUTH_CLIENT_SECRET,
        oauth_id: process.env.OAUTH_CLIENT_ID,
        subdomain: process.env.API_SUBDOMAIN
      },
      ui: {
        domain: hostname_parts_reversed[1],
        hostname: loc.hostname,
        subdomain: hostname_parts_reversed[2],
        subsubdomain: hostname_parts_reversed[3],
        tld: hostname_parts_reversed[0]
      },
      authenticated: isAuthenticated()
    };
  }

  onLogin() {
    this.setState({ authenticated: true });
  }

  onLogout() {
    this.setState({ authenticated: false });
  }

  render() {
    const { api, ui } = this.state;

    return (
      <div className="flex flex-1 flex-col h-screen w-full">
        <CheckEnvironmentVariables />
        <CheckApiStatus api={api} ui={ui} />
        <main className="flex-auto">
          {this.state.authenticated && (
            <Menu onLogout={() => this.onLogout()} />
          )}
          <Router className={this.state.authenticated ? "h-auto" : "h-full"}>
            <Home path="/" api={api} ui={ui} onLogin={() => this.onLogin()} />

            <CashSpecials path="/cash-specials" api={api} ui={ui} />
            <Customers path="/customers" api={api} ui={ui} />
            <Deals path="/deals" api={api} ui={ui} />
            <Settings path="/settings" api={api} ui={ui} />
            <Users path="/users" api={api} ui={ui} />

            <NotFound default />
          </Router>
        </main>
        <Footer authenticated={this.state.authenticated} />
      </div>
    );
  }
}

export default Entry;

ReactDOM.render(<Entry />, document.getElementById("app-root"));
