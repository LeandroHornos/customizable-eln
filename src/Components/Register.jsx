import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

// Firebase

import firebaseApp from "../firebaseApp";

/* Bootstrap */
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import UserSchema from "../Models/UserSchema.js";

function Register() {
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
      <div className="row row-custom-settings">
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
              Home
            </Link>
            <h1 className="page-title" style={{ fontSize: "2.2em" }}>
              Register
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

              <Form.Group>
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
                  handleSignUp();
                }}
              >
                Register
              </Button>
              <Button
                block
                variant="dark"
                onClick={(e) => {
                  history.push("/login");
                }}
              >
                I have an account
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
