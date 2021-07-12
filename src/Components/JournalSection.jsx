/*
Journal Section

<ReportEditor />
        |
        -- <JournalSection />

Esta sección aporta un editor de entradas de texto a forma
de bitácora. Cada entrada se identifica por la hora de creación.
Puede contener información adicional además de textos cortos.

Sirve para registrar observaciones a lo largo del tiempo, por ejemplo
los eventos de un experimento.

Props: 

section: objeto JSON
        contiene la información correspondiente a la sección.
        En section.layout está la información para dibujar el componente
        (no en este caso)
        En section.data se almacena la información ingresada por el usuario.

rid: id del reporte al que corresponde la sección
*/

import React, { useState, useEffect } from "react";

// React bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

// Firebase
import firebaseApp from "../firebaseApp";

import { checkObj } from "../utilities";

export const JournalSection = (props) => {
  const db = firebaseApp.firestore();
  const { rid } = props;

  // STATE
  const [section, setSection] = useState({});
  const [data, setData] = useState({ entries: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setStateFromProps = () => {
      // Al cargar el componente, cargo la info por props
      const sect = JSON.parse(props.section);
      const dt = { ...sect.data };
      const { exists, isEmpty } = checkObj(sect.data);
      setSection(sect);
      if (exists && !isEmpty) {
        setData(dt);
      }
      setLoading(false);
    };

    setStateFromProps();
  }, []);

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
      setData(sectionObj.data);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  const addNewEntry = (entry) => {
    saveSection({ ...section, data: { entries: [...data.entries, entry] } });
  };

  return loading ? (
    <div></div>
  ) : (
    <React.Fragment>
      <h3 className="color-2">{section.name}</h3>
      <p>{section.description}</p>
      <EntriesList entries={data.entries} />
      <JournalEntryForm addNewEntry={addNewEntry} />
    </React.Fragment>
  );
};

export const JournalEntryForm = (props) => {
  /* Input para agregar una nueva entrada a la bitácora.
  Al enviar, llama a la función addNewEntry que recibe por props.
  Dicha función actualiza la base de datos y el state del Journal */
  const { addNewEntry } = props;
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Cuando entran nuevas props cancelar el estado "saving"
    setSaving(false);
  }, [props]);

  const handleSubmit = () => {
    /* Al enviar el formulario paso el componente
    al estado "saving" y llamo a la función que se
    encargará de actualizar la base de datos. */
    setSaving(true);
    const now = new Date();
    addNewEntry({
      text,
      dateString: now.toLocaleString(),
      timestamp: now.getTime(),
    });
    setText("");
  };

  return (
    <React.Fragment>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Form.Group>
          <Form.Label>Nueva entrada</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Button type="sumbit">
          {saving ? "Guardando..." : "Agregar Entrada"}
        </Button>
      </Form>
    </React.Fragment>
  );
};

export const EntriesList = (props) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setStateFromProps = () => {
      setEntries(props.entries);
      setLoading(false);
    };
    setStateFromProps();
  }, [props]);
  return (
    !loading && (
      <React.Fragment>
        <div className="journal-cards-container">
          {entries.length === 0 ? (
            <p>
              <small>No hay entradas para mostrar</small>
            </p>
          ) : (
            entries.map((entry) => {
              return (
                <Card style={{ marginBottom: "10px" }} className="journal-card">
                  <Card.Header
                    style={{ padding: "5px" }}
                    className="journal-card-header"
                  >
                    <small>{entry.dateString}</small>
                  </Card.Header>
                  <Card.Body
                    style={{ padding: "10px 5px" }}
                    className="journal-card-header"
                  >
                    {entry.text}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </div>
      </React.Fragment>
    )
  );
};

export default JournalSection;
