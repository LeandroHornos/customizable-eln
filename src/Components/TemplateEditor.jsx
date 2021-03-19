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

  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
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
          <h1>Editor de plantillas</h1>
        </div>
      </div>
      <div className="row row-custom-settings">
        <div className="col-md-7">
          <div className="center-col-container ">
            <div className="template-box">
              <h2>Nombre la plantilla</h2>
              <input
                value={templateName}
                type="text"
                placeholder="Choose a name for the section"
                onChange={(e) => {
                  setTemplateName(e.target.value);
                }}
              ></input>
              <h2>Título</h2>
              <input
                value={title}
                type="text"
                placeholder="Choose a name for the section"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></input>
            </div>

            <div className="template-box">
              <h2>Agrega una nueva sección a la plantilla</h2>
              <div>
                <label>Título de la sección</label>
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
              <label>Clase de sección</label>
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
              <TableSectionConfig />
              <div>
                {" "}
                <Button
                  block
                  variant="success"
                  className="block-btn"
                  onClick={() => {
                    console.log("Nueva seccion", currentSection);
                    if (sectionIsComplete) {
                      setSections([...sections, currentSection]);
                    }
                    clearSectionForm();
                  }}
                >
                  Agregar sección
                </Button>
                <Button block variant="outline-dark" className="block-btn">
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="template-box">
            <h2 className="text-center">Vista previa de la plantilla</h2>
            <div className="section-config-box">
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
  const emptyCol = { name: "", type: "", order: null, unit: "" };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  // const [colNum, setColNum] = useState(0); // Cuantas columnas va a tener la tabla
  const [columns, setColumns] = useState([emptyCol]); // Las columnas con su info

  // Efects
  const handleColumns = (colNum, currentCols) => {
    console.log("Current cols", currentCols);
    console.log("Current cols length", currentCols.length);
    console.log("colNum", colNum);

    let cols = currentCols;
    let delta = colNum - currentCols.length;

    if (delta > 0) {
      console.log("hay columnas de menos");
      for (var y = 0; y < delta; y++) {
        console.log({ ...emptyCol, order: y });
        cols.push({ ...emptyCol, order: y });
      }
    } else {
      console.log("hay columnas de mas");
      let k = -1 * delta;
      cols = columns;
      for (var z = 0; z < k; z++) {
        cols.pop();
      }
    }

    setColumns(cols);
  };

  return (
    <div className="section-config-box">
      <h3>Table Config</h3>
      <p>How many columns does de table must have?</p>
      <select
        onChange={(e) => {
          handleColumns(e.target.value, columns);
        }}
      >
        {ops.map((cols) => {
          return <option value={cols}>{cols}</option>;
        })}
      </select>
    </div>
  );
};

export default TemplateEditor;
