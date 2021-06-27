import React, { useState, useEffect } from "react";

//React Bootstrap
import Form from "react-bootstrap";
import Button from "react-bootstrap";

// React router
import { history } from "react-router-dom";

// Components
import NavigationBar from "./NavigationBar";

export const Projects = () => {
  return (
    <React.Fragment>
      <NavigationBar />
    </React.Fragment>
  );
};

export const NewProjectForm = (props) => {
  const { saveProject } = props;

  const handleSubmit = () => {
    return;
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
        <Form.Control type="text"></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Número</Form.Label>
        <Form.Control type="number"></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" rows={3}></Form.Control>
      </Form.Group>
      <Button type="submit">Crear Proyecto</Button>
    </Form>
  );
};

export default Projects;
