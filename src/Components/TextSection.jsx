/*
TextSection: 
------------
Muestra una sección de texto dentro del Editor de Reporte <ReportEditor />
Esta seccion se compone de un textarea donde el usuario ingresa un bloque de texto
sin formato.
El componente permite al usuario tanto leer el texto contenido en la seccion
como un campo para editarlo, guardar cambios y borrarlo.
*/

import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export const TextSection = (props) => {
  const { saveSection } = props; // Actualiza la tabla en la base de datos
  const section = JSON.parse(props.section);
  let { name, description, data } = section;
  if (data === undefined) {
    data = { text: "" };
  } else if (!("text" in data)) {
    data = { ...data, text: "" };
  }
  const [currentText, setCurrentText] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
    Reinicio el state cuando entran nuevas props.
    Evita permanencia del texto al cambiar entre solapas 
    con el mismo componente
    */

    setCurrentText(data.text);
    setShowButtons(false);
    setLoading(false);
  }, [props]);

  const saveText = () => {
    saveSection({ ...section, data: { text: currentText } });
    console.log("Guardando texto...");
  };
  return (
    !loading && (
      <React.Fragment>
        <h3 className="color-2">{name}</h3>
        <p>{description}</p>
        <Form>
          <Form.Group>
            <Form.Control
              as="textarea"
              value={currentText}
              onChange={(e) => {
                setCurrentText(e.target.value);
                if (!showButtons) {
                  setShowButtons(true);
                }
              }}
            ></Form.Control>
          </Form.Group>
          {showButtons && (
            <React.Fragment>
              <Button
                variant="outline-primary"
                onClick={() => {
                  saveText();
                }}
              >
                Guardar cambios
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setCurrentText(data.text);
                  setShowButtons(false);
                }}
              >
                Cancelar
              </Button>
            </React.Fragment>
          )}
        </Form>
      </React.Fragment>
    )
  );
};

export default TextSection;
