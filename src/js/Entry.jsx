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
import Dashboard from "./components/Dashboard.jsx";
import { isAuthenticated } from "./helpers/auth";

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
    const { api, hostname, subdomain } = this.state;
    return (
      <div className="flex flex-1 flex-col h-screen w-full">
        <CheckEnvironmentVariables />
        <CheckApiStatus api={api} hostname={hostname} />
        <main className="flex-auto">
          {this.state.authenticated && (
            <Menu onLogout={() => this.onLogout()} />
          )}
          <Router className={this.state.authenticated ? "h-auto" : "h-full"}>
            <Home
              path="/"
              api={api}
              subdomain={subdomain}
              onLogin={() => this.onLogin()}
            />
            <Dashboard path="/dashboard" api={api} subdomain={subdomain} />
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
