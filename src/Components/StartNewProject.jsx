import React, { useState } from "react";

import firebaseApp from "../firebaseApp";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import NavigationBar from "./NavigationBar";

const StartNewProject = () => {
  const db = firebaseApp.firestore();
  const [name, setName] = useState("");
  const [number, setNumber] = useState(0);
  const [description, setDescription] = useState("");

  const validateForm = () => {
    let isValid = true;
    const errors = [];
    return { isValid, errors };
  };

  const handleSubmit = async () => {
    const now = new Date();
    const { isValid, errors } = validateForm();
    if (isValid) {
      const project = {
        name,
        number,
        description,
        creatorId: "",
        creationDate: now,
        creationTimestamp: now.getTime(),
        lastModifiedDate: now,
        lastModifiedTimestamp: now.getTime(),
        templates: [],
        usersIds: [],
        roles: [],
        reportsIds: [],
        reportsCount: 0,
      };
      console.log("Creando proyecto", project);
      // await db.collection("projects").add(project);
      return;
    } else {
      errors.forEach((err) => {
        console.log(err);
      });
    }
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h2>Nuevo Proyecto</h2>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Form.Group>
              <Form.Label>Nombre del proyecto</Form.Label>
              <Form.Control type="text"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Número del proyecto</Form.Label>
              <Form.Control type="number"></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={3}></Form.Control>
            </Form.Group>
            <Button type="submit">Crear proyecto</Button>
          </Form>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default StartNewProject;
