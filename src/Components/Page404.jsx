import React from "react";
import NavigationBar from "./NavigationBar";
const Page404 = () => {
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          <h1>404</h1>
          <p>Oops, parece que la página que estás buscando no existe</p>
        </div>
        <div className="col-md-1"></div>
      </div>
    </React.Fragment>
  );
};

export default Page404;
