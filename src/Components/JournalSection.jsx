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

saveSection(sectionObject): función
        función que toma la sección actualizada y la guarda
        dentro del documento correspondiente en la base de datos.
*/

import React, { useState, useEffect } from "react";

// React bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";

export const JournalSection = (props) => {
  const { saveSection } = props;
  const section = JSON.parse(props.section);
  let { name, description, data } = section;
  if (data === undefined) {
    data = { entries: [] };
  } else if (!("entries" in data)) {
    data = { ...data, entries: [] };
  }

  useEffect(() => {
    /*
      Reinicio el state cuando entran nuevas props.
      Evita permanencia del texto al cambiar entre solapas 
      con el mismo componente
      */
    console.log("Seccion de Journal", section);
    // eslint-disable-next-line
  }, [props]);

  const addNewEntry = (entry) => {
    saveSection({ ...section, data: { entries: [...data.entries, entry] } });
    
  };

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <EntriesList entries={data.entries} />
      <JournalEntryForm addNewEntry={addNewEntry} />
    </React.Fragment>
  );
};

export const JournalEntryForm = (props) => {
  const { addNewEntry } = props;
  const [text, setText] = useState("");

  const handleSubmit = () => {
    const now = new Date();
    console.log("submit");
    console.log(now);
    console.log(now.getTime());
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
        <Button type="sumbit">Agregar Entrada</Button>
      </Form>
    </React.Fragment>
  );
};

export const EntriesList = (props) => {
  const { entries } = props;
  return (
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
  );
};

export default JournalSection;
