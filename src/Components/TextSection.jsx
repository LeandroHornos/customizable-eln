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

// React Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Firebase
import firebaseApp from "../firebaseApp";

// Utils
import { checkObj } from "../utilities";

export const TextSection = (props) => {
  const { rid } = props; // id del reporte al que corresponde el componente
  const db = firebaseApp.firestore();

  // STATE
  const [section, setSection] = useState({});
  const [currentText, setCurrentText] = useState("");
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    /*
    Reinicio el state cuando entran nuevas props.
    Evita permanencia del texto al cambiar entre solapas 
    con el mismo componente
    */

    const setStateFromProps = () => {
      setSaving(false);
      setLoading(true);
      const sect = JSON.parse(props.section);
      const dt = { ...sect.data };
      const { exists, isEmpty } = checkObj(dt);

      setSection(sect);

      if (exists && !isEmpty) {
        setCurrentText(dt.text);
      } else if (isEmpty) {
        setCurrentText("");
      }
      setShowButtons(false);
      setLoading(false);
      console.log("Text section", section);
    };

    setStateFromProps();

    // eslint-disable-next-line
  }, [props]);

  const saveSection = async (sectionObj) => {
    // Guarda los cambios en la subcoleccion "sections" del reporte en la db
    try {
      await db
        .collection("reports")
        .doc(rid)
        .collection("sections")
        .doc(sectionObj.id)
        .update(sectionObj);
      setSection(sectionObj);
      setCurrentText(sectionObj.data.text);
      setShowButtons(false);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  const saveText = () => {
    const updatedSection = { ...section, data: { text: currentText } };
    saveSection(updatedSection);
  };
  return (
    !loading && (
      <React.Fragment>
        <h3 className="color-2">{section.name}</h3>
        <p>{section.description}</p>
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
                  setSaving(true);
                  saveText();
                }}
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => {
                  setCurrentText(section.data.text);
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
