import React from "react";

import NavigationBar from "./NavigationBar";

const Reports = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
              <h1 className="text-center">Reportes</h1>
          </div>
          <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default Reports;
