import React, { useState, useEffect, useContext } from "react";

import firebaseApp from "../firebaseApp";

import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

// Components
import NavigationBar from "./NavigationBar";

import { useParams, useHistory } from "react-router-dom";

import { makeId } from "../utilities";
import { Row } from "react-bootstrap";

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

// SECTION EDITORS

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

export const TableSection = (props) => {
  const cellObjects = () => {
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

    layout.columns.forEach((col) => {
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

  let { layout, name, description } = props.section;
  const [rows, setRows] = useState(layout.rows || {});
  const [newRow, setNewRow] = useState({
    id: makeId(16),
    order: Object.keys(rows).length,
    cells: cellObjects(),
  });

  const updateNewRow = (colId, value) => {
    let cells = newRow.cells;
    cells[colId].value = value;
    setNewRow({ ...newRow, cells: cells });
    console.log({ ...newRow, cells: cells });
  };

  const addNewRow = () => {
    let updatedRows = rows;
    updatedRows[newRow.id] = newRow;
    setRows(updatedRows);
    console.log("Filas", Object.keys(updatedRows).length);

    setNewRow({
      id: makeId(16),
      order: Object.keys(updatedRows).length,
      cells: cellObjects(),
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
              return <th key={col.id}>{col.name}</th>;
            })}
          </thead>
          <tbody>
            <tr>
              {layout.columns.map((col) => {
                return (
                  <td key={`${col.id}-row-0`} style={{ padding: "10px" }}>
                    0
                  </td>
                );
              })}
            </tr>
            <TableRows rows={rows} cols={layout.columns} />
            <tr>
              <td style={{ paddingTop: "60px" }}>Nueva Fila</td>
            </tr>
            <tr>
              {layout.columns.map((col) => {
                return (
                  <td key={`${col.id}-row-0`} style={{ padding: "0" }}>
                    <input
                      type={col.type}
                      value={newRow.cells[col.id].value}
                      placeholder={`${col.name} ${
                        col.unit
                      }`}
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
          <Button
            size="sm"
            variant="outline-primary"
            style={{ marginTop: "20px" }}
            onClick={() => {
              addNewRow();
            }}
          >
            Agregar fila
          </Button>
        </Table>
      </div>
    </React.Fragment>
  );
};

export const TableRows = (props) => {
  const { rows, cols } = props;

  // Transformo el objeto rows en un array con las filas:
  let rowsArray = Object.keys(rows).map((key) => {
    return { ...rows[key] };
  });

  // Ordeno el array segun el valor "order":
  rowsArray.sort((a, b) => {
    return a.order - b.order;
  });

  return (
    <React.Fragment>
      {rowsArray.map((row) => {
        return (
          <tr key={row.id}>
            {cols.map((col) => {
              return (
                <td key={`${row.id}-${col.id}`}>{row.cells[col.id].value}</td>
              );
            })}
          </tr>
        );
      })}
    </React.Fragment>
  );
};

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
