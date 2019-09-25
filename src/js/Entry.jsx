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
    var loc = window.location;
    // console.log("loc", loc);
    var hostname_parts_reversed = loc.hostname.split(".").reverse();
    this.state = {
      api: {
        healthcheck_route: process.env.API_HEALTHCHECK_ROUTE,
        port: process.env.API_PORT,
        route_prefix: process.env.API_ROUTE_PREFIX,
        subdomain: process.env.API_SUBDOMAIN
      },
      ui: {
        domain: hostname_parts_reversed[1],
        hostname: loc.hostname,
        subdomain: hostname_parts_reversed[2],
        subsubdomain: hostname_parts_reversed[3],
        tld: hostname_parts_reversed[0]
      }
    };
  }

  render() {
    const { api, ui } = this.state;
    // console.log("ui", ui);
    // console.log("api", api);
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
