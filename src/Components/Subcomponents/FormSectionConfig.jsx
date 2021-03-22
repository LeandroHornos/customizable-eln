/* FormSectionConfig: muestra las opciones de configuración
para una sección del tipo formulario. El componente permite
indicar cuantos campos va a contener la seccion de formulario
y brinda una lista de inputs donde permite asignarle un nombre
una clase (numero o texto) y una unidad a cada campo. */


/* FormSectionFieldList: genera la lista de inputs para cada campo,
a partir del número de campos a generar, que recibe por props. Además,
maneja los cambios de cada uno de los campos y los recopila en un
array que le pasa al componente padre FormSectionConfig */

import React, { useState, useEffect, useContext } from "react";

// React Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import Utils from "../../utilities";

const FormSectionConfig = (props) => {
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
      <FormSectionFieldList fields={fields} setFields={setFields} />
      <Button
        block
        variant="success"
        className="block-btn"
        onClick={() => {
          props.saveFields({ fields });
        }}
      >
        Agregar Nueva seccion
      </Button>
    </div>
  );
};

const FormSectionFieldList = (props) => {
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

  return loadedFields.map((field, index) => {
    // console.log("FIeld es:", field);
    return (
      <div key={field.id} style={{ margin: "10px 0px" }}>
        <Form>
          <Row>
            <Col sm={1}>{field.order + 1}</Col>
            <Col sm={4}>
              <Form.Control
                style={{ marginBottom: "10px" }}
                placeholder="Nombre"
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
                <option value="text">Texto</option>
                <option value="number">Numero</option>
              </Form.Control>
            </Col>
            <Col sm={3}>
              <Form.Control
                readOnly={field.type === "text"}
                style={{ marginBottom: "10px" }}
                placeholder="Unidad"
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
  });
};

export default FormSectionConfig;
