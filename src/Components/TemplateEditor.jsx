import React, { useState, useEffect } from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { makeId } from "../utilities";

// Components
import NavigationBar from "./NavigationBar";

const TemplateEditor = () => {
  const emptySection = {
    id: makeId(16),
    name: "",
    order: 0,
    description: "",
    component: "",
    layout: {},
  };

  const [selectedComponent, setSelectedComponent] = useState("");
  const [templateName, setTemplateName] = useState(""); // Nombre de la plantilla
  const [title, setTitle] = useState(""); // Nombre de la plantilla
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState({
    ...emptySection,
    id: makeId(16),
  }); // para comenzar crea un único objeto seccion vacío en secciones, y le asigna un id

  const handleSubmit = () => {
    const now = new Date();
    const timestamp = now.getTime();
    let template = {
      name: templateName,
      creationDate: timestamp,
      lastModified: timestamp,
      title,
      sections,
      creatorId: "",
    };
    console.log(template);
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
          <h1 className="text-center">Template Editor</h1>

          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <h2 className="text-center">Información general</h2>

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
            <h2 className="text-center">Secciones</h2>
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

export default TemplateEditor;
