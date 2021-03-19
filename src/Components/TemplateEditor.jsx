import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";

// Firebase

import firebaseApp from "../firebaseApp";

// Router
import { useHistory } from "react-router-dom";

import sectionSchema from "../Models/sectionSchema";
import templateSchema from "../Models/templateSchema";

const TemplateEditor = () => {
  const db = firebaseApp.firestore();
  const history = useHistory();

  const [title, setTitle] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(sectionSchema);
  const [sectionIsComplete, setSectionIsComplete] = useState(false);
  const clearSectionForm = () => {
    setCurrentSection(sectionSchema);
  };

  useEffect(() => {
    const { name, component } = currentSection;
    if (name !== "" && component !== "") {
      setSectionIsComplete(true);
    }
  }, [currentSection]);

  useEffect(() => {
    console.log("se ha agregado una nueva seccion", sections);
  }, [sections]);

  const saveNewTemplate = async () => {
    let template = { ...templateSchema, title, sections, creatorId: "" };

    console.log("vamos a grabar esta template:", template);
    try {
      await db.collection("templates").add(template);
      console.log("Nueva template creada con exito");
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="row row-custom-settings">
        <div className="col-12">
          <h1>Template Editor</h1>
        </div>
      </div>
      <div className="row row-custom-settings">
        <div className="col-md-6">
          <div className="center-col-container">
            <h4>Template Title</h4>
            <input
              value={title}
              type="text"
              placeholder="Choose a name for the section"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></input>
            <h4>Add a new section to the template</h4>
            <div>
              <label>Section title</label>
              <input
                value={currentSection.name}
                type="text"
                placeholder="Choose a name for the section"
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    name: e.target.value,
                  });
                }}
              ></input>
            </div>
            <div>
              <label>Section Component</label>
              <select
                value={currentSection.component}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    component: e.target.value,
                  });
                }}
              >
                <option value="">Select a section class</option>
                <option value="header-section">Header</option>
                <option value="text-section">Text block</option>
                <option value="table-section">Table</option>
                <option value="journal-section">Journal</option>
                <option value="form-section">Form</option>
              </select>
            </div>
            <Button
              className="block-btn"
              onClick={() => {
                console.log("Nueva seccion", currentSection);
                if (sectionIsComplete) {
                  setSections([...sections, currentSection]);
                }
                clearSectionForm();
              }}
            >
              Add Section
            </Button>
            <Button className="block-btn">Clear</Button>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Template Preview</h4>
          <div className="template-preview-cont">
            <h5 className="text-center">{title}</h5>
            {sections.map((section) => {
              return (
                <div>
                  <h5>{section.name}</h5>
                  <p>{section.component}</p>
                </div>
              );
            })}
          </div>
          <Button
            block
            variant="success"
            className="block-btn"
            onClick={saveNewTemplate}
          >
            Save Template
          </Button>
        </div>
      </div>
    </div>
  );
};

// SUBCOMPONENTS

const TableSectionConfig = (props) => {
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [colNum, setColNum] = useState(0); // Cuantas columnas va a tener la tabla
  const [columns, setColumns] = useState([]); // Las columnas con su info

  // Efects
  useEffect(() => {
    /* Escuchar cambios en el número de columnas que va a tener la tabla y crear una lista de objetos
    para contener la info de cada columna.
    */
    let cols = [];
    if (columns.lenght === 0) {
      //{ crear n columnas nuevas, n = colNum}
    } else if (columns.length < colNum) {
      // { crear n columnas nuevas, n = (colNum - columnas.lenght)}
    } else if (columns.lenght > colNum) {
      // {borrar las últimas n columnas, n = n = (columnas.lenght- colNum)}
    }
    setColumns(cols);
  }, [colNum]);

  return (
    <div>
      <p>How many columns does de table must have?</p>
      <select
        onChange={(e) => {
          setColumns(e.target.value);
        }}
      >
        {ops.map((cols) => {
          <option value={cols}>{cols}</option>;
        })}
      </select>
    </div>
  );
};

export default TemplateEditor;
