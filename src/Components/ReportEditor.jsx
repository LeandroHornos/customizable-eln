/* 
REPORT EDITOR

Este componente es el elemento central del trabajo con el cuaderno electrónico. Una vez creado un reporte a partir
de una plantilla, ReportEditor toma los elementos del layout para construir la interfaz del reporte. 
Cada tipo de sección se carga en un componente específico que se encarga tanto de mostrar la información como de
proveer las herramientas necesarias para su edicion. 
El reporte provee un sistema de navegación que permite pasar entre los distintos componentes, además de dar acceso a 
herramientas relacionadas.
Cada componente se encarga de actualizar los cambios de su sección en el reporte

*/

import React, { useState, useEffect, useContext } from "react";

import firebaseApp from "../firebaseApp";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

// Components
import NavigationBar from "./NavigationBar";

import { useParams, useHistory } from "react-router-dom";

import { makeId } from "../utilities";

const cellObjects = (cols) => {
  /* Devuelve un objeto que contiene como claves los ids
  de las columnas y como valor un objeto que contiene la 
  información correspondiente a la
  celda en dicha columna dentro de una fila dada.
  Cada fila (row) contiene uno de estos objetos cells, los cuales
  guardan todos los valores correspondientes a una fila. De esta manera,
  cualquier valor de la tabla puede ser llamado como
  valor = rows[rowId].cells[colId].value
   */
  let cells = {};

  cols.forEach((col) => {
    cells[col.id] = {
      colId: col.id,
      colNumber: col.order,
      value: "",
      unit: col.unit,
      type: col.type,
    };
  });

  return cells;
};

export const ReportEditor = () => {
  const { id } = useParams();
  const db = firebaseApp.firestore();
  const history = useHistory();
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("este es el id del reporte", id);
    if (!id || id === "") {
      setReport({});
      return;
    }

    const fetchData = async () => {
      try {
        let rep = await db.collection("reports").doc(id).get();
        rep = { ...rep.data(), id: rep.id };
        setReport(rep);
        console.log(rep);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-12">
          <h1 className="text-center" style={{ paddingBottom: "40px" }}>
            Reporte
          </h1>
        </div>
      </div>
      {!loading && (
        <React.Fragment>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-5">
              <div>
                <h2 className="color-1-light">
                  Proyecto: {report.projectName}
                </h2>
                <h2 className="color-1-light">
                  Reporte: {report.reportNumber}
                </h2>
              </div>
            </div>
            <div className="col-md-5">
              <h3>Descripción:</h3>
              <p>{report.description}</p>
            </div>
            <div className="col-md-1"></div>
          </div>
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              <hr />
              <ReportNavigator />
              <FormSection section={report.sections[0]} />
              <TextSection section={report.sections[1]} />
              <TableSection section={report.sections[3]} />
            </div>
            <div className="col-md-1"></div>
          </div>
          <footer style={{ minHeight: "100px" }}></footer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export const ReportNavigator = (props) => {
  return (
    <Nav fill variant="tabs" defaultActiveKey="/home">
      <Nav.Item>
        <Nav.Link href="/home">Active</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-1">Loooonger NavLink</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="link-2">Link</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Disabled
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

// SECTION EDITORS:

export const FormSection = (props) => {
  let { layout, name, description } = props.section;

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <Form>
        {layout.fields.map((field) => {
          return (
            <Form.Group key={field.id}>
              <Form.Label>{field.name}</Form.Label>
              {field.type === "text" && (
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    // Actualizar State
                    return;
                  }}
                ></Form.Control>
              )}
              {field.type === "number" && (
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    // Actualizar State
                    return;
                  }}
                ></Form.Control>
              )}
              {field.type === "date" && <input type="date"></input>}
            </Form.Group>
          );
        })}
      </Form>
    </React.Fragment>
  );
};

/* TABLE SECTION  ----------------------------------- */

export const TableSection = (props) => {
  let { layout, name, description } = props.section;
  const [rows, setRows] = useState(layout.rows || {});
  const [newRow, setNewRow] = useState({
    id: makeId(16),
    order: Object.keys(rows).length,
    cells: cellObjects(layout.columns),
  });

  const updateNewRow = (colId, value) => {
    let cells = newRow.cells;
    cells[colId].value = value;
    setNewRow({ ...newRow, cells: cells });
    console.log({ ...newRow, cells: cells });
  };

  const cancelEdit = () => {
    setNewRow({
      id: makeId(16),
      order: Object.keys(rows).length,
      cells: cellObjects(layout.columns),
    });
    console.log("se cancela el edit, estas son las filas", rows);
  };

  const saveRow = (row) => {
    console.log("asi están las filas antes de guardar cambios", rows);
    let updatedRows = rows;
    updatedRows[row.id] = row;
    setRows(updatedRows);
    console.log("Filas", Object.keys(updatedRows).length);

    setNewRow({
      id: makeId(16),
      order: Object.keys(updatedRows).length,
      cells: cellObjects(layout.columns),
    });
    console.log("Se han actualizado las filas:", rows);
  };

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <div className="table-container">
        <Table>
          <thead>
            {layout.columns.map((col) => {
              return (
                <th key={col.id}>{`${col.name} ${col.unit != "" ? " [" : ""}${
                  col.unit
                }${col.unit != "" ? "]" : ""}`}</th>
              );
            })}
          </thead>
          <tbody>
            <TableRows
              rows={rows}
              cols={layout.columns}
              saveRow={saveRow}
              cancelEdit={cancelEdit}
            />
            <tr>
              <td style={{ paddingTop: "60px" }} colspane={layout.columns}>
                Nueva Fila
              </td>
            </tr>
            <tr>
              {layout.columns.map((col) => {
                return (
                  <td key={`${col.id}-row-0`} style={{ padding: "0" }}>
                    <input
                      type={col.type}
                      value={newRow.cells[col.id].value}
                      placeholder={`${col.name}`}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (col.type === "number") {
                          val = parseFloat(val);
                        }
                        updateNewRow(col.id, val);
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        margin: "0",
                        border: "none",
                        padding: "5px",
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          </tbody>
          <ButtonGroup>
            {" "}
            <Button
              size="sm"
              variant="outline-primary"
              style={{ marginTop: "20px" }}
              onClick={() => {
                saveRow(newRow);
              }}
            >
              Agregar fila
            </Button>
            <Button
              size="sm"
              variant="outline-dark"
              style={{ marginTop: "20px" }}
              onClick={() => {
                cancelEdit();
              }}
            >
              Cancelar
            </Button>
          </ButtonGroup>
        </Table>
      </div>
    </React.Fragment>
  );
};

export const TableRows = (props) => {
  /* Muestra el contenido de las filas de la tabla
  recibe por props un objeto que contiene como claves los
  ids de las filas(rows). A su vez cada fila contiene un objeto cells
  con los valores de las columnas como clave.
  */
  const { rows, cols, saveRow, cancelEdit } = props;
  const [editThisRow, setEditThisRow] = useState("");
  const [loading, setLoading] = useState(true);
  const [rowsArray, setRowsArray] = useState([]);

  useEffect(() => {
    console.log("han cambiado las filas", rows);
    let array = Object.keys(rows).map((key) => {
      return { ...rows[key] };
    });
    array.sort((a, b) => {
      return a.order - b.order;
    });
    setRowsArray(array);
    setLoading(false);
  }, [props]);

  return (
    <React.Fragment>
      {!loading &&
        rowsArray.map((row) => {
          /*
        Si la fila tiene su id marcado para ser editada, en lugar
        de mostrar una fila normal se muestra una serie de inputs con un
        boton que permiten editar y actualizar la tabla.
        */
          if (editThisRow === row.id) {
            return (
              <TableRowEditor
                rowId={row.id}
                cells={row.cells}
                order={row.order}
                mode="edit"
                cols={cols}
                setEditThisRow={setEditThisRow}
                saveRow={saveRow}
              />
            );
          } else {
            return (
              <tr key={row.id}>
                {cols.map((col, index) => {
                  if (index === 0) {
                    return (
                      <td key={`${row.id}-${col.id}`}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditThisRow(row.id);
                          }}
                        >
                          {row.cells[col.id].value}
                        </a>
                      </td>
                    );
                  } else {
                    return (
                      <td key={`${row.id}-${col.id}`}>
                        {row.cells[col.id].value}
                      </td>
                    );
                  }
                })}
              </tr>
            );
          }
        })}
    </React.Fragment>
  );
};

export const TableRowEditor = (props) => {
  /* Este componente es igual al que permite crear una nueva fila.
  Se inserta en la tabla en aquella fila que ha sido seleccionada para ser
  editada. Utiliza su propio estado para almacenar los valores del input,
  y luego utiliza la funcion saveRow de la sección tabla para actualizar
  el contenido de la fila en la tabla */
  const { rowId, order, cols, cells, mode, saveRow, setEditThisRow } = props;
  const [editedRow, setEditedRow] = useState({
    id: rowId,
    order: order,
    cells: cells,
  });

  const updateEditedRow = (colId, value) => {
    let cells = { ...editedRow.cells };
    cells[colId].value = value;
    setEditedRow({ ...editedRow, cells: cells });
  };

  return (
    <React.Fragment>
      <tr>
        {cols.map((col) => {
          return (
            <td key={`${col.id}-row-0`} style={{ padding: "0" }}>
              <input
                type={col.type}
                value={editedRow.cells[col.id].value}
                placeholder={`${col.name}`}
                onChange={(e) => {
                  let val = e.target.value;
                  if (col.type === "number") {
                    val = parseFloat(val);
                  }
                  updateEditedRow(col.id, val);
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  margin: "0",
                  border: "none",
                  padding: "5px",
                }}
              />
            </td>
          );
        })}
      </tr>
      <tr>
        <td colspan={cols.length} className="editor-row">
          <ButtonGroup size="sm">
            <Button
              size="sm"
              variant="outline-primary"
              onClick={() => {
                saveRow(editedRow);
                setEditThisRow("");
              }}
            >
              {mode === "edit" ? "Guardar Cambios" : "Agregar fila"}
            </Button>
            <Button
              size="sm"
              variant="outline-dark"
              onClick={() => {
                console.log("Cancelando");
                setEditThisRow("");
              }}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              onClick={() => {
                setEditThisRow("");
              }}
            >
              Eliminar Fila
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </React.Fragment>
  );
};

/* TEXT SECTION ------------------------------------- */

export const TextSection = (props) => {
  let { layout, name, description } = props.section;
  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <Form>
        <Form.Group>
          <Form.Control as="textarea"></Form.Control>
        </Form.Group>
      </Form>
    </React.Fragment>
  );
};

export default ReportEditor;
