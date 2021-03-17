import React from "react";

// Router
import { useHistory, Link } from "react-router-dom";

// Bootstrap
import Button from "react-bootstrap/Button";

// Firebase
import firebaseApp from "../firebaseApp";

const SignOut = () => {
  const history = useHistory();

  const handleSignOut = async () => {
    try {
      await firebaseApp.auth().signOut();
      history.push("./");
      console.log("has salido");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="checklist-wall-window">
      <div className="row" style={styles.row}>
        <div className="col-md-3"></div>
        <div
          className="col-md-6 d-flex flex-column justify-content-center"
          style={{ minHeight: "100vh" }}
        >
          <Link
            style={{
              fontSize: "3.5em",
              textAlign: "center",
              color: "rgba(250,250,250,0.55)",
            }}
            to="/"
          >
            Checklist<span style={{ color: "red" }}>-</span>me
          </Link>
          <h1 className="page-title" style={{ fontSize: "2.2em" }}>
            Sign Out
          </h1>
          <h4
            style={{
              padding: "20px 10px",
              textAlign: "center",
              color: "white",
            }}
          >
            ¿ Are you leaving ?
          </h4>
          <Button
            variant="danger"
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
          >
            Yes, I'm out!
          </Button>
          <Button
            variant="success"
            onClick={() => {
              history.goBack();
            }}
            style={{ marginTop: "20px" }}
          >
            No, take me back.
          </Button>
        </div>
        <div className="col-md-3"></div>
      </div>
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
  },
  row: {
    boxSizing: "border-box",
    padding: "0px 10px",
    margin: "0px",
    minHeight: "80vh",
  },
};

export default SignOut;
