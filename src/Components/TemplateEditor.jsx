import React from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const TemplateEditor = () => {
  return (
    <React.Fragment>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h1>Template Editor</h1>
          <h2>Información general</h2>
          <Form></Form>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default TemplateEditor;
