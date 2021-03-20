import React, { useContext } from "react";

import { useHistory } from "react-router-dom";
import { LanguageContext } from "../Lang";

//
import Button from "react-bootstrap/Button";

import NavigationBar from "./NavigationBar";

const Dashboard = () => {
  const history = useHistory();
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.components.dashboard;
  console.log("DICTIONARY:", dictionary);
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row row-custom-settings min-h-80">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="center-col-container">
            <h1 style={styles.h1}>{txt.title}</h1>
            <Button
              onClick={() => {
                history.push("/template-editor");
              }}
            >
              {txt.templateEditor}
            </Button>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

const styles = {
  h1: { padding: "40px 10px" },
  h4: { padding: "20px 0px", width: "100%" },
  row: {
    boxSizing: "border-box",
    padding: "0px 10px",
    margin: "0px",
    minHeight: "80vh",
  },
};
export default Dashboard;
