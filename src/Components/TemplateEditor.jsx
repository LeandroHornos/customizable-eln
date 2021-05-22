import React, { useState, useEffect } from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { makeId } from "../utilities";

// Firebase
import firebaseApp from "../firebaseApp";

// Router
import { useHistory } from "react-router-dom";

// Components
import NavigationBar from "./NavigationBar";

const TemplateEditor = () => {
  const emptySection = {
    component: "",
    description: "",
    id: makeId(16),
    layout: {},
    name: "",
    order: 0,
  };

  const db = firebaseApp.firestore();
  const history = useHistory();
  const [selectedComponent, setSelectedComponent] = useState("");
  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
  const [title, setTitle] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    ...emptySection,
    id: makeId(16),
  }); // para comenzar crea un único objeto seccion vacío en secciones, y le asigna un id

  const handleSubmit = async () => {
    const now = new Date();
    const timestamp = now.getTime();
    let template = {
      creationDate: timestamp,
      category: "",
      creatorId: "",
      keywords: [""],
      lastModified: timestamp,
      name: templateName,
      privacy: "public",
      sections,
      status: "active",
      title,
    };
    try {
      await db.collection("templates").add(template);
      console.log("Nueva template creada con exito");
      console.log("Esta es la nueva plantilla:", template);
      history.push("/");
    } catch (error) {
      console.log("Ha ocurrido un error al guardar la plantilla", error);
    }
  };
  const addCurrentSectionToTemplate = (layout) => {
    /* Recibe el objeto de un componente de configuración
    y guarda la sección con dicho objeto en data. */

    const newSection = { ...currentSection, layout: layout };

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
    } else {
      // Si no existe el objeto agrego uno nuevo:
      const updatedSections = [...sections, newSection];
      setSections(updatedSections);
      console.log("secciones actualizadas", updatedSections);
    }

    clearSectionForm();
  };

  const clearSectionForm = () => {
    setCurrentSection({
      ...emptySection,
      id: makeId(16),
    });
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2 col-lg-3"></div>
        <div className="col-md-8 col-lg-6">
          <h1 className="text-center">Nueva Plantilla</h1>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className="">Información general</h2>

            <Form.Group>
              <Form.Label>Nombre de la plantilla</Form.Label>
              <Form.Control
                value={templateName}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
            {/* -------------- SECTIONS EDITOR -------------------- */}
            <h2 className="">Secciones</h2>
            <h3>Nueva Sección</h3>
            <Form.Group>
              <Form.Label>Nombre de la sección</Form.Label>
              <Form.Control
                value={currentSection.name}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    name: e.target.value,
                  });
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentSection.description}
                onChange={(e) => {
                  setCurrentSection({
                    ...currentSection,
                    description: e.target.value,
                  });
                }}
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Componente</Form.Label>
              <Form.Control
                as="select"
                value={selectedComponent}
                onChange={(e) => {
                  setSelectedComponent(e.target.value);
                  setCurrentSection({
                    ...currentSection,
                    component: e.target.value,
                  });
                }}
              >
                <option value="">Elije una opción</option>
                <option value="text">Bloque de texto</option>
                <option value="table">Tabla</option>
                <option value="form">Formulario</option>
              </Form.Control>
            </Form.Group>
            <SectionEditorSwitch
              component={selectedComponent}
              saveSection={addCurrentSectionToTemplate}
              setSelectedComponent={setSelectedComponent}
            />
            <Button block type="submit">
              Guardar Plantilla
            </Button>
          </Form>
        </div>
        <div className="col-md-2 col-lg-3"></div>
      </div>
    </React.Fragment>
  );
};

const SectionEditorSwitch = (props) => {
  /* 
    Devuelve el editor correspondiente al
    tipo de componente seleccionado en el
    editor de secciones
  */
  const { component, saveSection, setSelectedComponent } = props;
  const reset = () => {
    setSelectedComponent("");
  };
  switch (component) {
    case "table":
      return <TableSectionConfig saveSection={saveSection} reset={reset} />;
    case "text":
      return <TextSectionConfig saveSection={saveSection} reset={reset} />;
    case "form":
      return <FormSectionConfig saveSection={saveSection} reset={reset} />;
    default:
      return <div></div>;
  }
};

/* SECTION EDITORS----------------------------------- */

// Table Section_____________________________________

export const TableSectionConfig = (props) => {
  const { saveSection, reset } = props;
  const emptyCol = {
    id: "",
    name: "",
    order: 0,
    type: "text",
    unit: "",
  };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [columns, setColumns] = useState([{ ...emptyCol, id: makeId(16) }]);

  useEffect(() => {}, [columns]);

  const handleColumns = (colNum, currentColumns) => {
    let cols = [...currentColumns];
    let delta = colNum - currentColumns.length;

    if (delta > 0) {
      // console.log("hay campos de menos");
      for (var y = 0; y < delta; y++) {
        cols.push({
          ...emptyCol,
          order: y + currentColumns.length,
          id: makeId(16),
        });
      }
    } else {
      // console.log("hay campos de mas");
      let k = -1 * delta;
      for (var z = 0; z < k; z++) {
        cols.pop();
      }
    }

    setColumns(cols);
  };
  return (
    <div className="section-config-box">
      <p>
        Esta sección provee una tabla, utiliza los siguientes campos para
        configurar el contenido de las columnas
      </p>
      <select
        value={columns.length}
        onChange={(e) => {
          handleColumns(e.target.value, columns);
        }}
      >
        {ops.map((cols) => {
          return (
            <option key={makeId(4)} value={cols}>
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
          saveSection({ columns });
          reset();
        }}
      >
        Agregar sección
      </Button>
    </div>
  );
};

export const TableSectionColList = (props) => {
  const [loadedColumns, setLoadedColumns] = useState(props.columns);

  useEffect(() => {
    setLoadedColumns(props.columns);
  }, [props]);

  const handleNameChange = (colId, name) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.name = name;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
  };

  const handleTypeChange = (colId, colClass) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.type = colClass;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
  };

  const handleUnitChange = (colId, unit) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.unit = unit;
      }
      return col;
    });
    props.setColumns(newColumns);
    // setLoadedColumns(newColumns);
  };

  return (
    <React.Fragment>
      {loadedColumns.map((col) => {
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
                      if (e.target.value === "text") {
                        handleUnitChange(col.id, "");
                      }
                    }}
                  >
                    <option value="text">Texto</option>
                    <option value="number">Numero</option>
                    <option value="date">Fecha</option>
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

// Text Section______________________________________
export const TextSectionConfig = (props) => {
  const { saveSection, reset } = props;
  const [chars, setChars] = useState(300);
  const [rows, setRows] = useState(3);
  return (
    <div className="section-config-box">
      <p>Estas sección provee un bloque de texto</p>
      <Row>
        <Col>
          {" "}
          <Form.Group>
            <Form.Label>Caracteres</Form.Label>
            <Form.Control
              as="select"
              value={chars}
              onChange={(e) => {
                setChars(parseInt(e.target.value));
              }}
            >
              <option value={300}>300</option>
              <option value={140}>140</option>
              <option value={500}>500</option>
              <option value={800}>800</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Filas</Form.Label>
            <Form.Control
              as="select"
              value={rows}
              onChange={(e) => {
                setRows(parseInt(e.target.value));
              }}
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          saveSection({
            maxChars: chars,
            rows,
          });
          reset();
        }}
      >
        Guardar Sección
      </Button>
    </div>
  );
};

// Form Section_______________________________________
export const FormSectionConfig = (props) => {
  const { saveSection, reset } = props;
  const emptyField = {
    id: "",
    name: "",
    order: 0,
    type: "text",
    unit: "",
  };
  const ops = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Opciones del select para el nro de columnas
  const [fields, setFileds] = useState([{ ...emptyField, id: makeId(16) }]);

  const handleFields = (fieldNum, currentFields) => {
    let cols = [...currentFields];
    let delta = fieldNum - currentFields.length;

    if (delta > 0) {
      // console.log("hay campos de menos");
      for (var y = 0; y < delta; y++) {
        cols.push({
          ...emptyField,
          order: y + currentFields.length,
          id: makeId(16),
        });
      }
    } else {
      // console.log("hay campos de mas");
      let k = -1 * delta;
      for (var z = 0; z < k; z++) {
        cols.pop();
      }
    }

    setFileds(cols);
  };
  return (
    <div className="section-config-box">
      <p>
        Esta sección provee un formulario sencillo, con campos en los que se
        puede ingresar texto o números Uiliza los siguientes campos para
        configurar los campos que confomaran el formulario
      </p>
      <select
        value={fields.length}
        onChange={(e) => {
          handleFields(e.target.value, fields);
        }}
      >
        {ops.map((flds) => {
          return (
            <option key={makeId(4)} value={flds}>
              {flds}
            </option>
          );
        })}
      </select>
      <FormSectionFieldList fields={fields} setFileds={setFileds} />
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          saveSection({ fields });
          reset();
        }}
      >
        Agregar sección
      </Button>
    </div>
  );
};

export const FormSectionFieldList = (props) => {
  const [loadedColumns, setLoadedColumns] = useState(props.fields);

  useEffect(() => {
    setLoadedColumns(props.fields);
  }, [props]);

  const handleNameChange = (colId, name) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.name = name;
      }
      return col;
    });
    props.setFileds(newColumns);
    // setLoadedColumns(newColumns);
  };

  const handleTypeChange = (colId, colClass) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.type = colClass;
      }
      return col;
    });
    props.setFileds(newColumns);
    // setLoadedColumns(newColumns);
  };

  const handleUnitChange = (colId, unit) => {
    const newColumns = loadedColumns.map((col) => {
      if (colId === col.id) {
        col.unit = unit;
      }
      return col;
    });
    props.setFileds(newColumns);
    // setLoadedColumns(newColumns);
  };

  return (
    <React.Fragment>
      {loadedColumns.map((col) => {
        return (
          <div key={col.id} style={{ margin: "10px 0px" }}>
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
                    if (e.target.value === "text") {
                      handleUnitChange(col.id, "");
                    }
                  }}
                >
                  <option value="text">Texto</option>
                  <option value="number">Numero</option>
                  <option value="date">Fecha</option>
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
          </div>
        );
      })}
    </React.Fragment>
  );
};

export default TemplateEditor;
