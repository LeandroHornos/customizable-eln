/* TableSectionConfig: muestra las opciones de configuración
para una sección del tipo tabla. El componente permite
indicar cuantas columnas va a contener la tabla
y brinda una lista de inputs donde permite asignarle un nombre
una clase (numero o texto) y una unidad a cada columna. */

/* TableSectionFieldList: genera la lista de inputs para cada campo,
a partir del número de campos a generar, que recibe por props. Además,
maneja los cambios de cada uno de los campos y los recopila en un
array que le pasa al componente padre TableSectionConfig */

import React, { useState, useEffect, useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import Utils from "../../utilities";

const TableSectionConfig = (props) => {
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
      <h3>Column Section Config Sarasaaaa</h3>
      <p>How many columns must the form have?</p>
      <select
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
          props.saveColumns({ columns });
        }}
      >
        Agregar Nueva seccion
      </Button>
    </div>
  );
};

const TableSectionColList = (props) => {
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

export default TableSectionConfig;
