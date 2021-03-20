import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

import { LanguageContext } from "../Lang";

/* Bootstrap */
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import UserSchema from "../Models/UserSchema.js";

import NavigationBar from "./NavigationBar";

const Register = () => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.components.register;
  const gtxt = dictionary.general;
  const db = firebaseApp.firestore();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      await firebaseApp.auth().createUserWithEmailAndPassword(email, password);
      const newUser = firebaseApp.auth().currentUser;
      const userData = {
        ...UserSchema,
        email: newUser.email,
        uid: newUser.uid,
      };
      await db.collection("users").add(userData);
      console.log("nuevo usuario creado con exito");
      history.push("./");
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
            <Link
              style={{
                fontSize: "3.5em",
                textAlign: "center",
                color: "rgba(250,250,250,0.55)",
              }}
              to="/"
            >
              {gtxt.home}
            </Link>
            <h1
              className="page-title"
              style={{ fontSize: "2.2em", color: "red" }}
            >
              {gtxt.signUp}
            </h1>
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

              <Form.Group>
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
                  handleSignUp();
                }}
              >
                {gtxt.signUp}
              </Button>
              <Button
                block
                variant="outline-info"
                onClick={(e) => {
                  history.push("/login");
                }}
              >
                {txt.haveAccount}
              </Button>
            </Form>
          </div>
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
    justifyContent: "center",
    height: "100%",
  },
  row: {
    boxSizing: "border-box",
    padding: "0px 10px",
    margin: "0px",
    minHeight: "80vh",
  },
};

export default Register;
