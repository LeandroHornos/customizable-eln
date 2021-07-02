import React, { useContext } from "react";

import { useHistory } from "react-router-dom";

// React Bootstrap
import Button from "react-bootstrap/Button";

// Components
import NavigationBar from "./NavigationBar";
import Groups from "./Groups";
import AppFooter from "./AppFooter";

// Dev
import { peter } from "../demoUsers";

const Dashboard = () => {
  const user = { ...peter };
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <h1>Mis grupos</h1>
          <Groups />
        </div>
        <div className="col-md-1"></div>
      </div>
      <AppFooter />
    </React.Fragment>
  );
};

export default Dashboard;
