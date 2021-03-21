import React, { useState, useEffect, useContext } from "react";

import Button from "react-bootstrap/Button";

// Firebase
import firebaseApp from "../firebaseApp";

// Context
import { LanguageContext } from "../Lang";

// Router
import { useHistory } from "react-router-dom";

// Data structure
import sectionSchema from "../Models/sectionSchema";
import templateSchema from "../Models/templateSchema";

// Components
import NavigationBar from "./NavigationBar";

const TemplateEditor = () => {
  const db = firebaseApp.firestore();
  const history = useHistory();

  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.components.templateEditor;
  const gtxt = dictionary.general;

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
      <NavigationBar />
      <div className="row row-custom-settings">
        <div className="col-12">
          <h1>{txt.title}</h1>
        </div>
      </div>
      <div className="row row-custom-settings">
        <div className="col-md-7">
          <div className="center-col-container ">
            <div className="template-box">
              <h2>{txt.templateName}</h2>
              <input
                value={templateName}
                type="text"
                placeholder={txt.tempNamePlaceholder}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                }}
              ></input>
              <h2>{txt.templateTitle}</h2>
              <input
                value={title}
                type="text"
                placeholder={txt.tempTitlePlaceholder}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></input>
            </div>

            <div className="template-box">
              <h2>{txt.addNewSection}</h2>
              <div>
                <label>{txt.sectionTitle}</label>
                <input
                  value={currentSection.name}
                  type="text"
                  placeholder={txt.secTitlePlaceholder}
                  onChange={(e) => {
                    setCurrentSection({
                      ...currentSection,
                      name: e.target.value,
                    });
                  }}
                ></input>
              </div>
              <label>{txt.sectionClass}</label>
              <select
                value={currentSection.component}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    component: e.target.value,
                  });
                }}
              >
                <option value="">{txt.secClassPlaceholder}</option>
                <option value="header-section">{txt.compNames.header}</option>
                <option value="text-section">{txt.compNames.textBlock}</option>
                <option value="table-section">{txt.compNames.table}</option>
                <option value="journal-section">{txt.compNames.journal}</option>
                <option value="form-section">{txt.compNames.form}</option>
              </select>
              {currentSection.component === "table-section" && (
                <TableSectionConfig />
              )}
              {currentSection.component === "form-section" && (
                <FormSectionConfig />
              )}
              <div>
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
                  {txt.addNewSection}
                </Button>
                <Button block variant="outline-dark" className="block-btn">
                  {gtxt.clear}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div
            className="template-box"
            style={{ backgroundColor: "rgb(50,50,50)" }}
          >
            <h2 className="text-center temp-preview-header">
              {txt.templatePreviewHeader}
            </h2>
            {(sections.length > 0 || title != "") && (
              <div
                className="section-config-box"
                style={{ backgroundColor: "white" }}
              >
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
            )}
          </div>
          <Button
            block
            variant="success"
            className="block-btn"
            onClick={saveNewTemplate}
          >
            {txt.templateSaveButton}
          </Button>
        </div>
      </div>
    </div>
  );
};

// SUBCOMPONENTS

const FormSectionConfig = (props) => {
  const emptyField = { id: "", name: "", order: 0, type: "", unit: "" };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [fields, setFields] = useState([emptyField]);

  const handleFields = (fieldNum, currentFields) => {
    console.log("Current fields", currentFields);
    console.log("Current fields length", currentFields.length);
    console.log("fieldNum", fieldNum);

    let flds = [...currentFields];
    let delta = fieldNum - currentFields.length;

    if (delta > 0) {
      console.log("hay campos de menos");
      for (var y = 0; y < delta; y++) {
        console.log({ ...emptyField, order: y });
        flds.push({ ...emptyField, order: y });
      }
    } else {
      console.log("hay campos de mas");
      let k = -1 * delta;
      // flds = [...fields];
      for (var z = 0; z < k; z++) {
        flds.pop();
        console.log("pop!");
      }
    }

    setFields(flds);
  };
  return (
    <div className="section-config-box">
      <h3>Form Section Config</h3>
      <p>How many fields must the form have?</p>
      <select
        onChange={(e) => {
          handleFields(e.target.value, fields);
        }}
      >
        {ops.map((flds) => {
          return <option value={flds}>{flds}</option>;
        })}
      </select>
      <FormSectionFieldList fields={fields} />
    </div>
  );
};

const FormSectionFieldList = (props) => {
  return props.fields.map((field) => {
    return (
      <div key={`field-${field.order}`}>
        <div>
          <label>Nombre:</label>
          <input type="text"></input>
        </div>
        <div>
          <label>Clase:</label>
          <select>
            <option value=""></option>
            <option value="text">Texto</option>
            <option value="number">Numero</option>
          </select>
        </div>
        <div>
          <label>Unidad:</label>
          <input type="text"></input>
        </div>
      </div>
    );
  });
};

const TableSectionConfig = (props) => {
  const emptyCol = { id: "", name: "", order: null, type: "", unit: "" };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
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
      <p>How many columns must the table have?</p>
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
