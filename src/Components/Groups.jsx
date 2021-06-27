import React, { useState, useEffect } from "react";

//React Bootstrap
import Form from "react-bootstrap";
import Button from "react-bootstrap";

// React router
import { history } from "react-router-dom";

// Components
import NavigationBar from "./NavigationBar";

const Groups = () => {
  return (
    <React.Fragment>
      <NavigationBar />
    </React.Fragment>
  );
};

export const NewGroupForm = (props) => {
  const { saveGroup } = props;

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
        <Form.Label>Descripción</Form.Label>
        <Form.Control as="textarea" rows={3}></Form.Control>
      </Form.Group>
      <Button type="submit">Crear Grupo</Button>
    </Form>
  );
};
export default Groups;
