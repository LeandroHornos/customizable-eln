import React from "react";

// React-bootstrap
import Button from "react-bootstrap/Button";

import { useHistory } from "react-router-dom";

const Welcome = () => {
  // Router
  const history = useHistory();
  return (
    <div className="row row-custom-settings min-h-80">
      <div className="col-md-3"></div>
      <div className="col-md-6">
        <div className="center-col-container">
          <h2 style={{ fontSize: "3em", padding: "20px 0px" }}>Welcome</h2>
          <p>Do something</p>

          <Button
            onClick={() => {
              history.push("/login");
            }}
            block
            variant="outline-success"
            style={{
              padding: "10px 0px",
              margin: "10px 0px",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              history.push("/register");
            }}
            block
            variant="outline-success"
            style={{
              padding: "10px 0px",
              margin: "10px 0px",
            }}
          >
            Create new account
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
  centerColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100%",
  },
  row: {
    boxSizing: "border-box",
    padding: "0px 10px",
    margin: "0px",
    minHeight: "80vh",
  },
};
export default Welcome;
