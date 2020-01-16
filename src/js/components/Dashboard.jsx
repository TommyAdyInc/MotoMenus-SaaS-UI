import React from "react";
import axios from "axios";
import { isAuthenticated } from "../helpers/auth";
import { Redirect } from "@reach/router";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!isAuthenticated()) {
      return <Redirect noThrow={true} to="/" />;
    }

    return (
      <div className="px-4 py-4 w-full h-full flex-grow">
        This is our dashboard
      </div>
    );
  }
}

export default Dashboard;
