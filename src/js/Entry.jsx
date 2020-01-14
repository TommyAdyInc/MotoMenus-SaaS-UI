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
        oauth_secret: process.env.OAUTH_CLIENT_SECRET,
        oauth_id: process.env.OAUTH_CLIENT_ID,
        api_url: process.env.API_URL
      },
      hostname: window.location.hostname,
      subdomain: window.location.hostname.split(".")[0],
      login: null
    };
  }

  setLogin(data) {
    this.setState({ login: data });
  }

  render() {
    const { api, hostname, subdomain } = this.state;
    return (
      <div>
        <CheckEnvironmentVariables />
        <CheckApiStatus api={api} hostname={hostname} />
        <main>
          <Router>
            <Home
              path="/"
              onLogin={data => this.setLogin(data)}
              api={api}
              subdomain={subdomain}
            />
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
