import React, { useState, useEffect } from "react";

// React Bootstrap Components
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import ButtonSpinner from "./ButtonSpinner";

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
  const { saveSection } = props; // Actualiza la tabla en la base de datos
  const [section, setSection] = useState({}); // Toda la info de la sección
  const [layout, setLayout] = useState({}); // Info para presentar la GUI
  const [data, setData] = useState({}); // Aquí se almacena el contenido de la tabla
  const [rows, setRows] = useState({}); // Filas de la tabla
  const [rowsAsArray, setRowsAsArray] = useState([]); // Array de las filas, para mostrar en pantalla
  const [savingChanges, setSavingChanges] = useState(false);
  const [loading, setLoading] = useState(true); // Permite cargar la info antes de renderizar el componente
  const [newRow, setNewRow] = useState({}); // Almacena el contenido de los inputs al editar

  useEffect(() => {
    const loadDataFromProps = () => {
      const newSection = JSON.parse(props.section);
      const emptySection = { data: { rows: {} } }; // Si la sección no tiene data proveo un objeto vacío
      const sect = { ...emptySection, ...newSection }; // Si hay data, piso el objeto vacío
      setSection(sect);
      setLayout(sect.layout);
      setData(sect.data);
      setRows(sect.data.rows);
      setRowsAsArray(rowsObjToArray(sect.data.rows));
      setNewRow({
        id: makeId(16),
        order: rows ? Object.keys(rows).length : 0,
        cells: cellObjects(sect.layout.columns),
      });
    };

    loadDataFromProps();
    setSavingChanges(false);
    setLoading(false);
    // eslint-disable-next-line
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
      data: { ...data, rows: updatedRows },
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
      data: { ...data, rows: updatedRows },
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
      <p className="component-explanation">
        Haz click sobre el número de la fila para editarla
      </p>
      <div className="table-container">
        {!loading && (
          <Table>
            <thead>
              <th scope="col">#</th> {/* Columna vacia para los botones */}
              {layout.columns.map((col) => {
                return (
                  <th key={col.id}>{`${col.name} ${
                    col.unit !== "" ? " [" : ""
                  }${col.unit}${col.unit !== "" ? "]" : ""}`}</th>
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
                <td style={{ paddingTop: "60px" }} colSpan={layout.columns + 1}>
                  Nueva Fila
                </td>
              </tr>
              <tr>
                <td>#</td>
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
              <tr>
                <td colSpan={layout.columns.length}>
                  <ButtonGroup>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      style={{ marginTop: "20px", marginRight: "2px" }}
                      onClick={() => {
                        setSavingChanges(true);
                        saveRow(newRow);
                      }}
                    >
                      {savingChanges ? (
                        <ButtonSpinner text="Guardando..." />
                      ) : (
                        "Agregar fila"
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      style={{ marginTop: "20px" }}
                      onClick={() => {
                        cancelNewRow();
                      }}
                    >
                      Cancelar
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            </tbody>
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
  const [savingChanges, setSavingChanges] = useState(false);
  const [editThisRow, setEditThisRow] = useState(""); // Recibe el id de la fila a editar
  const [loading, setLoading] = useState(false);
  const [editedRow, setEditedRow] = useState({}); // Guarda los datos que se estan editando

  const updateEditedRow = (colId, value) => {
    let { id, order, cells } = editedRow;
    cells[colId].value = value;
    setEditedRow({ id, order, cells });
  };

  useEffect(() => {
    setSavingChanges(false);
  }, [props]);

  return (
    <React.Fragment>
      {!loading &&
        props.rowsAsArray.map((row, index) => {
          /*
          Si la fila tiene su id marcado para ser editada, en lugar
          de mostrar una fila normal se muestra una serie de inputs con un
          boton que permiten editar y actualizar la tabla.
          */
          if (editThisRow === row.id) {
            return (
              <React.Fragment>
                <tr>
                  <th scope="row">
                    <Button
                      style={{ padding: "0px" }}
                      variant="link"
                      onClick={() => {
                        setEditThisRow("");
                      }}
                    >
                      {index + 1}
                    </Button>
                  </th>
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
                  <td colSpan={cols.length + 1} className="editor-row">
                    <ButtonGroup size="sm">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          saveRow(editedRow);
                          setEditThisRow("");
                          setSavingChanges(true);
                        }}
                      >
                        {savingChanges ? (
                          <ButtonSpinner text="Guardando..." />
                        ) : (
                          "Guardar Cambios"
                        )}
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
                          setSavingChanges(true);
                          deleteRow(row.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              </React.Fragment>
            );
          } else {
            return (
              <tr key={row.id}>
                <th scope="row">
                  <Button
                    style={{ padding: "0px" }}
                    variant="link"
                    onClick={() => {
                      setEditedRow(row);
                      setEditThisRow(row.id);
                    }}
                  >
                    {index + 1}
                  </Button>
                </th>
                {cols.map((col) => {
                  return (
                    <td key={`${row.id}-${col.id}`}>
                      {row.cells[col.id].value}
                    </td>
                  );
                })}
              </tr>
            );
          }
        })}
    </React.Fragment>
  );
};

export default TableSection;
