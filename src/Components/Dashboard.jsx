import React from "react";

// Components
import NavigationBar from "./NavigationBar";
import Groups from "./Groups";
import AppFooter from "./AppFooter";

const Dashboard = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <div className="page-head">
            <h1>Mis grupos de trabajo</h1>
          </div>
          <Groups />
        </div>
        <div className="col-md-1"></div>
      </div>
      <AppFooter />
    </React.Fragment>
  );
};

export default Dashboard;
