import React from "react";

// Components
import NavigationBar from "./NavigationBar";
import Groups from "./Groups";
import AppFooter from "./AppFooter";
import HeadBlock from "./HeadBlock";

const Dashboard = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <HeadBlock>
        <h1>Mis grupos de trabajo</h1>
      </HeadBlock>
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <Groups />
        </div>
        <div className="col-md-1"></div>
      </div>
      <AppFooter />
    </React.Fragment>
  );
};

export default Dashboard;
