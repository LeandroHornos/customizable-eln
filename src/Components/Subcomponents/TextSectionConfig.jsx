import React, { useState, useEffect, useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";

import Utils from "../../utilities";

// Context 
import { LanguageContext } from "../../Lang";

const FormSectionConfig = (props) => {
  const emptyField = {
    id: "",
    name: "",
    order: 0,
    type: "text",
    unit: "",
  };
  return (
    <div className="section-config-box">
      <h3>Text Section Config</h3>
      <p>How many fields must the form have?</p>
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveSection({
            maxChars: "500",
            id: Utils.makeId(16),
            text: "",
          });
        }}
      >
        Agregar Nueva seccion
      </Button>
    </div>
  );
};

export default FormSectionConfig;
