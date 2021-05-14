import React, { useState, useEffect, useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

// Firebase
import firebaseApp from "./src/firebaseApp";

// Context
import { LanguageContext } from "../Lang";
import { AuthContext } from "../Auth";

// Router
import { useHistory } from "react-router-dom";

// Data structure
import sectionSchema from "../Models/sectionSchema";
import templateSchema from "./src/Models/templateSchema";

// Components & Subcomponents
import NavigationBar from "./src/Components/NavigationBar";

import Utils from "./src/utilities";

export const TemplateEditor = () => {
  const db = firebaseApp.firestore();
  const history = useHistory();

  const { dictionary } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);
  const txt = dictionary.components.templateEditor;
  const gtxt = dictionary.general;

  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
  const [title, setTitle] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    ...sectionSchema,
    id: Utils.makeId(16),
  }); // para comenzar crea un único objeto seccion vacío en secciones, y le asigna un id

  const clearSectionForm = () => {
    setCurrentSection({
      ...sectionSchema,
      id: Utils.makeId(16),
    });
  };

  const saveNewTemplate = async () => {
    let template = {
      ...templateSchema,
      title,
      sections,
      creatorId: currentUser.uid,
    };

    console.log("vamos a grabar esta template:", template);
    try {
      await db.collection("templates").add(template);
      console.log("Nueva template creada con exito");
      console.log("Esta es la nueva plantilla:", template);
      history.push("/");
    } catch (error) {
      console.log("Ha ocurrido un error al guardar la plantilla", error);
    }
  };

  const addCurrentSectionToTemplate = (sectionData) => {
    /* Recibe el objeto de un componente de configuración
    y guarda la sección con dicho objeto en data. */

    const newSection = { ...currentSection, data: sectionData };

    // Compruebo si ya existe una seccion con el id de la actual:
    const sectionExists = sections.some(
      (section) => section.id === currentSection.id
    );

    // Si la seccion ya existe reemplazo el objeto
    if (sectionExists) {
      console.log("la seccion ya existe, actualizando");
      let updatedSections = sections.map((section) => {
        if (section.id === currentSection.id) {
          section = newSection;
        }
        return section;
      });
      setSections(updatedSections);
      console.log("se han actualizado las secciones:", updatedSections);
      console.log("hay este numero de secciones:", updatedSections.length);
    } else {
      // Si no existe el objeto agrego uno nuevo:
      console.log(
        "estas son las secciones antes de agregar una nueva:",
        sections
      );
      let updatedSections = sections;
      updatedSections.push(newSection);
      setSections(updatedSections);
      console.log("Se han actualizado las secciones", updatedSections);
      console.log("hay este numero de secciones:", updatedSections.length);
    }

    clearSectionForm();
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
              {/* INFO GENERAL DE LA PLANTILLA ---------------- */}
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
              {/* AGREGAR Y CONFIGURAR SECCIONES -------------- */}
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
                <option value="text-section">{txt.compNames.textBlock}</option>
                <option value="table-section">{txt.compNames.table}</option>
                <option value="form-section">{txt.compNames.form}</option>
              </select>
              {currentSection.component === "table-section" && (
                <TableSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "form-section" && (
                <FormSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              {currentSection.component === "text-section" && (
                <TextSectionConfig saveSection={addCurrentSectionToTemplate} />
              )}
              <div>
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

export const FormSectionConfig = (props) => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.subcomponents.FormSectionConfig;
  const gtxt = dictionary.general;
  const emptyField = {
    id: "",
    name: "",
    order: 0,
    type: "text",
    unit: "",
  };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [fields, setFields] = useState([
    { ...emptyField, id: Utils.makeId(16) },
  ]);

  const handleFields = (fieldNum, currentFields) => {
    // console.log("Current fields", currentFields);
    // console.log("Current fields length", currentFields.length);
    // console.log("fieldNum", fieldNum);

    let flds = [...currentFields];
    let delta = fieldNum - currentFields.length;

    if (delta > 0) {
      // console.log("hay campos de menos");
      for (var y = 0; y < delta; y++) {
        flds.push({
          ...emptyField,
          order: y + currentFields.length,
          id: Utils.makeId(16),
        });
      }
    } else {
      // console.log("hay campos de mas");
      let k = -1 * delta;
      // flds = [...fields];
      for (var z = 0; z < k; z++) {
        flds.pop();
        // console.log("pop!");
      }
    }

    setFields(flds);
  };
  return (
    <div className="section-config-box">
      <h3>{txt.title}</h3>
      <p>{txt.explanation}</p>
      <select
        value={fields.length}
        onChange={(e) => {
          handleFields(e.target.value, fields);
        }}
      >
        {ops.map((flds) => {
          return (
            <option key={Utils.makeId(4)} value={flds}>
              {flds}
            </option>
          );
        })}
      </select>
      <FormSectionFieldList fields={fields} setFields={setFields} />
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveSection({ fields });
        }}
      >
        {txt.saveSection}
      </Button>
    </div>
  );
};

export const FormSectionFieldList = (props) => {
  const { dictionary } = useContext(LanguageContext);
  // const txt = dictionary.subcomponents.FormSectionConfig;
  const gtxt = dictionary.general;
  const [loadedFields, setLoadedFields] = useState(props.fields);

  useEffect(() => {
    setLoadedFields(props.fields);
  }, [props]);

  const handleNameChange = (fieldId, name) => {
    // console.log("editando nombre. Edited fields:", loadedFields);
    const newFields = loadedFields.map((field) => {
      if (fieldId === field.id) {
        field.name = name;
      }
      return field;
    });
    props.setFields(newFields);
    // setLoadedFields(newFields);
    console.log("HandleNameChange dice campo editado:", newFields);
  };

  const handleTypeChange = (fieldId, fieldClass) => {
    // console.log("editando nombre. Edited fields:", loadedFields);
    const newFields = loadedFields.map((field) => {
      if (fieldId === field.id) {
        field.type = fieldClass;
      }
      return field;
    });
    props.setFields(newFields);
    // setLoadedFields(newFields);
    console.log("HanldeClassChange dice campo editado:", newFields);
  };

  const handleUnitChange = (fieldId, unit) => {
    // console.log("editando nombre. Edited fields:", loadedFields);
    const newFields = loadedFields.map((field) => {
      if (fieldId === field.id) {
        field.unit = unit;
      }
      return field;
    });
    props.setFields(newFields);
    // setLoadedFields(newFields);
    console.log("campo editado:", newFields);
  };

  return (
    <React.Fragment>
      {loadedFields.map((field) => {
        // console.log("FIeld es:", field);
        return (
          <div key={field.id} style={{ margin: "10px 0px" }}>
            <Form>
              <Row>
                <Col sm={1}>{field.order + 1}</Col>
                <Col sm={4}>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    placeholder={gtxt.name}
                    value={field.name}
                    onChange={(e) => {
                      handleNameChange(field.id, e.target.value);
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    as="select"
                    value={field.type}
                    onChange={(e) => {
                      handleTypeChange(field.id, e.target.value);
                      if (e.target.value == "text") {
                        handleUnitChange(field.id, "");
                      }
                    }}
                  >
                    <option value="text">{gtxt.text}</option>
                    <option value="number">{gtxt.number}</option>
                  </Form.Control>
                </Col>
                <Col sm={3}>
                  <Form.Control
                    readOnly={field.type === "text"}
                    style={{ marginBottom: "10px" }}
                    placeholder={gtxt.unit}
                    value={field.unit}
                    onChange={(e) => {
                      handleUnitChange(field.id, e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export const TableSectionConfig = (props) => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.subcomponents.TableSectionConfig;
  // const gtxt = dictionary.general;
  const emptyCol = {
    id: "",
    name: "",
    order: 0,
    type: "text",
    unit: "",
  };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [columns, setColumns] = useState([
    { ...emptyCol, id: Utils.makeId(16) },
  ]);

  useEffect(() => {
    console.log("Se cambiaron las columnas:", columns);
  }, [columns]);

  const handleColumns = (colNum, currentColumns) => {
    console.log("Current columns", currentColumns);
    console.log("Current columns length", currentColumns.length);
    console.log("colNum", colNum);

    let cols = [...currentColumns];
    let delta = colNum - currentColumns.length;

    if (delta > 0) {
      // console.log("hay campos de menos");
      for (var y = 0; y < delta; y++) {
        cols.push({
          ...emptyCol,
          order: y + currentColumns.length,
          id: Utils.makeId(16),
        });
      }
    } else {
      // console.log("hay campos de mas");
      let k = -1 * delta;
      // cols = [...columns];
      for (var z = 0; z < k; z++) {
        cols.pop();
        // console.log("pop!");
      }
    }

    setColumns(cols);
  };
  return (
    <div className="section-config-box">
      <h3>{txt.title}</h3>
      <p>{txt.explanation}</p>
      <select
        value={columns.length}
        onChange={(e) => {
          handleColumns(e.target.value, columns);
          console.log(columns);
        }}
      >
        {ops.map((cols) => {
          return (
            <option key={Utils.makeId(4)} value={cols}>
              {cols}
            </option>
          );
        })}
      </select>
      <TableSectionColList columns={columns} setColumns={setColumns} />
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveSection({ columns });
        }}
      >
        {txt.saveSection}
      </Button>
    </div>
  );
};

export const TableSectionColList = (props) => {
  const [loadedColumns, setLoadedColumns] = useState(props.columns);

  useEffect(() => {
    console.log("loaded columns:", props.columns);
    setLoadedColumns(props.columns);
  }, [props]);

  const handleNameChange = (colId, name) => {
    // console.log("editando nombre. Edited columns:", loadedColumns);
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.name = name;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
    console.log("HandleNameChange dice campo editado:", newColumns);
  };

  const handleTypeChange = (colId, colClass) => {
    // console.log("editando nombre. Edited columns:", loadedColumns);
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.type = colClass;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
    console.log("HanldeClassChange dice campo editado:", newColumns);
  };

  const handleUnitChange = (colId, unit) => {
    // console.log("editando nombre. Edited columns:", loadedColumns);
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.unit = unit;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
    console.log("campo editado:", newColumns);
  };

  return (
    <React.Fragment>
      {loadedColumns.map((col) => {
        console.log("Columna es:", col);
        return (
          <div key={col.id} style={{ margin: "10px 0px" }}>
            <Form>
              <Row>
                <Col sm={1}>{col.order + 1}</Col>
                <Col sm={4}>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    placeholder="Nombre"
                    value={col.name}
                    onChange={(e) => {
                      handleNameChange(col.id, e.target.value);
                    }}
                  />
                </Col>
                <Col sm={4}>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    as="select"
                    value={col.type}
                    onChange={(e) => {
                      handleTypeChange(col.id, e.target.value);
                      if (e.target.value == "text") {
                        handleUnitChange(col.id, "");
                      }
                    }}
                  >
                    <option value="text">Texto</option>
                    <option value="number">Numero</option>
                  </Form.Control>
                </Col>
                <Col sm={3}>
                  <Form.Control
                    readOnly={col.type === "text"}
                    style={{ marginBottom: "10px" }}
                    placeholder="Unidad"
                    value={col.unit}
                    onChange={(e) => {
                      handleUnitChange(col.id, e.target.value);
                    }}
                  />
                </Col>
              </Row>
            </Form>
          </div>
        );
      })}
    </React.Fragment>
  );
};

export const TextSectionConfig = (props) => {
  const { dictionary } = useContext(LanguageContext);
  const txt = dictionary.subcomponents.TextSectionConfig;

  return (
    <div className="section-config-box">
      <h3>{txt.title}</h3>
      <p>{txt.explanation}</p>
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveSection({
            maxChars: "500",
            id: Utils.makeId(16),
            info: "",
            text: "",
          });
        }}
      >
        {txt.saveSection}
      </Button>
    </div>
  );
};

export default TemplateEditor;
