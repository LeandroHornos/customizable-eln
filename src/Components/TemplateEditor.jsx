import React, { useState, useEffect } from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Utils from "../utilities";

// Components
import NavigationBar from "./NavigationBar";

const TemplateEditor = () => {
  const [selectedComponent, setSelectedComponent] = useState("");
  const handleSubmit = () => {
    console.log("Submit");
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
              <Form.Control></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Título</Form.Label>
              <Form.Control></Form.Control>
            </Form.Group>
            {/* -------------- SECTIONS EDITOR -------------------- */}
            <h2 className="text-center">Secciones</h2>
            <h3>Nueva Sección</h3>
            <Form.Group>
              <Form.Label>Componente</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => {
                  setSelectedComponent(e.target.value);
                }}
              >
                <option value="">Elije una opción</option>
                <option value="text">Bloque de texto</option>
                <option value="table">Tabla</option>
                <option value="form">Formulario</option>
              </Form.Control>
            </Form.Group>
            <SectionEditorSwitch component={selectedComponent} />
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
  const { component } = props;
  switch (component) {
    case "table":
      return <TableSectionConfig />;
    default:
      return <div></div>;
  }
};

/* SECTION EDITORS----------------------------------- */

// Table Section

export const TableSectionConfig = (props) => {
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
      <h3>Sección tabla</h3>
      <p>
        Esta sección provee una tabla, utiliza los siguientes campos para
        configurar el contenido de las columnas
      </p>
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
        Agregar sección
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

export default TemplateEditor;
