import React, { useState, useEffect } from "react";

import firebaseApp from "../firebaseApp";

// React Bootstrap Components
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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

/* TABLE SECTION  ----------------------------------- */

export const TableSection = (props) => {
  const { saveSection } = props;
  const [section, setSection] = useState({});
  const [layout, setLayout] = useState({});
  const [rows, setRows] = useState({});
  const [rowsAsArray, setRowsAsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({});

  useEffect(() => {
    const newSection = JSON.parse(props.section);
    setSection(newSection);
    setLayout(newSection.layout);
    if (newSection.layout.rows) {
      setRows(newSection.layout.rows);
    } else {
      setRows({});
    }
    setRowsAsArray(rowsObjToArray(newSection.layout.rows));
    setNewRow({
      id: makeId(16),
      order: rows ? Object.keys(rows).length : 0,
      cells: cellObjects(newSection.layout.columns),
    });
    setLoading(false);
  }, [props]);

  const updateNewRow = (colId, value) => {
    let cells = newRow.cells;
    cells[colId].value = value;
    setNewRow({ ...newRow, cells: cells });
    console.log({ ...newRow, cells: cells });
  };

  const cancelNewRow = () => {
    setNewRow({
      id: makeId(16),
      order: Object.keys(rows).length,
      cells: cellObjects(layout.columns),
    });
    console.log("se cancela el edit, estas son las filas", rows);
  };

  const saveRow = (row) => {
    /* Crea una copia del objeto rows, luego modifica
      la fila correspondiente en la copia y finalmente
      actualiza rows en el state. Si no hiciera la copia del objeto
      al modificar el valor de la clave se modifica directamente
      rows por fuera del setState() */
    let updatedRows = JSON.parse(JSON.stringify(rows)); // Para que no se modifique directamente rows
    updatedRows[row.id] = row;
    // setRows(updatedRows);
    saveSection({
      ...section,
      layout: { ...section.layout, rows: updatedRows },
    });

    setNewRow({
      id: makeId(16),
      order: Object.keys(updatedRows).length,
      cells: cellObjects(layout.columns),
    });
    console.log("Se han actualizado las filas:", rows);
  };

  const deleteRow = (rowId) => {
    let updatedRows = JSON.parse(JSON.stringify(rows)); // Obtengo una copia del objeto rows
    console.log(
      "Estas son las filas antes de la eliminación",
      JSON.parse(JSON.stringify(rows))
    );
    const order = updatedRows[rowId].order;
    delete updatedRows[rowId]; // Elimino la fila indicada por id
    const keys = Object.keys(updatedRows);
    if (keys && keys.length > 0) {
      keys.forEach((key) => {
        if (updatedRows[key].order > order) {
          updatedRows[key].order = updatedRows[key].order - 1;
        }
      });
    }
    console.log("estas son las filas luego de la eliminación", updatedRows);
    saveSection({
      ...section,
      layout: { ...section.layout, rows: updatedRows },
    });
    setRows(updatedRows);
  };

  const rowsObjToArray = (rowsObj) => {
    if (!rowsObj) {
      console.log("no hay filas que mostrar");
      return [];
    }

    let array = Object.keys(rowsObj).map((key) => {
      return { ...rowsObj[key] };
    });
    array.sort((a, b) => {
      return a.order - b.order;
    });
    return array;
  };

  return (
    <React.Fragment>
      <h3 className="color-2 section-title">{section.name}</h3>
      <p>{section.description}</p>
      <div className="table-container">
        {!loading && (
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
                rows={JSON.stringify(rows)}
                rowsAsArray={rowsAsArray}
                cols={layout.columns}
                saveRow={saveRow}
                deleteRow={deleteRow}
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
                  cancelNewRow();
                }}
              >
                Cancelar
              </Button>
            </ButtonGroup>
          </Table>
        )}
      </div>
    </React.Fragment>
  );
};

export const TableRows = (props) => {
  /* Muestra el contenido de las filas de la tabla.
    Recibe por props un array con las filas (rows) construido
    a partir del objeto rows: report.sections[sectionId].layout.rows
    Permite identificar una fila a editar por su Id haciendo click
    en el primer elemento de la fila. Al hacerlo, muestra para esa fila
    un conjunto de celdas con inputs para poder modificar los valores de
    cada celda, y un conjunto de botones que permiten guardar los cambios,
    descartarlos o borrar la fila entera. Las funciones son provistas por
    el componente padre TableSection
    Cuando se aplican los cambios a la fila, la función correspondiente se
    encarga de actualizar el documento dentro de la base de datos y volver a 
    cargar el contenido.
    */
  const { cols, saveRow, deleteRow } = props;
  const [editThisRow, setEditThisRow] = useState(""); // Recibe el id de la fila a editar
  const [loading, setLoading] = useState(false);
  const [editedRow, setEditedRow] = useState({}); // Guarda los datos que se estan editando

  const updateEditedRow = (colId, rowId, value) => {
    let { id, order, cells } = editedRow;
    cells[colId].value = value;
    setEditedRow({ id, order, cells });
  };

  return (
    <React.Fragment>
      {!loading &&
        props.rowsAsArray.map((row) => {
          /*
          Si la fila tiene su id marcado para ser editada, en lugar
          de mostrar una fila normal se muestra una serie de inputs con un
          boton que permiten editar y actualizar la tabla.
          */
          if (editThisRow === row.id) {
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
                            updateEditedRow(col.id, row.id, val);
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
                        Guardar Cambios
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-dark"
                        onClick={() => {
                          setEditThisRow("");
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => {
                          deleteRow(row.id);
                        }}
                      >
                        Eliminar Fila
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              </React.Fragment>
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
                            setEditedRow(row);
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

export default TableSection;
