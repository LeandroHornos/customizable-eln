import React, { useState } from "react";

import { useHistory, Link } from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSignIn = async () => {
    try {
      await firebaseApp.auth().signInWithEmailAndPassword(email, password);
      history.push("./");
      console.log("usuario logueado");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="row" style={styles.row}>
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div style={styles.centerColumn}>
            <Link
              style={{
                fontSize: "3.5em",
                textAlign: "center",
                color: "rgba(250,250,250,0.55)",
              }}
              to="/"
            >
              Home
            </Link>
            <h1 className="page-title" style={{ fontSize: "2.2em" }}>
              Sign In
            </h1>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>
              <Button
                block
                variant="success"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignIn();
                }}
              >
                Enter
              </Button>
              <Button
                block
                variant="dark"
                onClick={(e) => {
                  history.push("/register");
                }}
              >
                I don't have an account
              </Button>
            </Form>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

const styles = {
  h1: { padding: "40px 10px" },
  h4: { padding: "20px 0px", width: "100%" },
  centerColumn: {
    display: "flex",
    flexDirection: "column",
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

export default Login;
