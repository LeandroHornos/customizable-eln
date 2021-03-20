import React, { useState, useContext } from "react";

import { useHistory } from "react-router-dom";

// Context 
import { LanguageContext } from "../Lang";

// Firebase
import firebaseApp from "../firebaseApp";

// React Bootstrap Components
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Components
import NavigationBar from "./NavigationBar";

function Login() {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.components.login;
  const gtxt = dictionary.general;
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
      <NavigationBar />
      <div className="row row-custom-settings min-h-80">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="center-col-container">
            <h1 style={{ fontSize: "2.2em", color: "red" }}>{gtxt.signIn}</h1>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>{gtxt.email}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={txt.emailPlaceholder}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>{gtxt.password}</Form.Label>
                <Form.Control
                  type="password"
                  placeholder={txt.passPlaceholder}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </Form.Group>
              <Button
                block
                className="dark-btn"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSignIn();
                }}
              >
                {gtxt.signIn}
              </Button>
              <Button
                block
                variant="outline-info"
                onClick={(e) => {
                  history.push("/register");
                }}
              >
                {txt.noAccount}
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
