import React from "react";

import { useHistory } from "react-router-dom";

//
import Button from "react-bootstrap/Button";

const Dashboard = () => {
  const history = useHistory();
  return (
    <div className="row row-custom-settings">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        <div className="center-col-container">
          <h1 style={styles.h1}>Lets start</h1>
          <Button
            onClick={() => {
              history.push("/template-editor");
            }}
          >
            Template Editor
          </Button>
        </div>
      </div>
      <div className="col-md-3"></div>
    </div>
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
