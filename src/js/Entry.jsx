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
import NotFound from "./components/NotFound.jsx";

class Entry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: {
        healthcheck_route: process.env.API_HEALTHCHECK_ROUTE,
        port: process.env.API_PORT,
        route_prefix: process.env.API_ROUTE_PREFIX,
        subdomain: process.env.API_SUBDOMAIN
      },
      ui: {
        domain: window.location.hostname.split(".")[1],
        hostname: window.location.hostname,
        subdomain: window.location.hostname.split(".")[0],
        tld: window.location.hostname.split(".")[2]
      }
    };
  }

  render() {
    const { api, ui } = this.state;
    return (
      <div>
        <CheckEnvironmentVariables />
        <CheckApiStatus api={api} ui={ui} />
        <main>
          <Router>
            <Home path="/" />
            <NotFound default />
          </Router>
        </main>
        <Footer />
      </div>
    );
  }
}

export default Entry;

ReactDOM.render(<Entry />, document.getElementById("app-root"));
