import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

const FileLinksSection = (props) => {
  const { saveSection } = props; // Actualiza la tabla en la base de datos
  const section = JSON.parse(props.section);
  let { name, description, data } = section;
  if (data === undefined) {
    data = { links: [] };
  } else if (!("links" in data)) {
    data = { ...data, links: [] };
  }

  useEffect(() => {
    console.log("File link Section: ", JSON.parse(props.section));
  }, [props]);

  const saveFileLink = (obj) => {
    console.log("Se va a salvar el siguiente link", obj);
    saveSection({ ...section, data: { links: [...data.links, obj] } });
  };

  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <Table>
        <thead>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Link</th>
        </thead>
        <tbody>
          {data.links.map((link) => {
            return (
              <tr key={link.url}>
                <td>
                  <img
                    src={`/img/icons/${link.type}.png`}
                    alt=""
                    srcset=""
                    height="40px"
                  />
                </td>
                <td>{link.description}</td>
                <td>
                  <a style={{ overflowX: "hidden" }} href={link.url} target="_blank">
                    {link.url.substr(0, 30) + "..."}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h4>Nuevo Archivo enlazado</h4>
      <NewLinkForm saveFileLink={saveFileLink} />
    </React.Fragment>
  );
};

const NewLinkForm = (props) => {
  const { saveFileLink } = props;
  const [url, setUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileDescription, setFileDescription] = useState("");

  const validateForm = () => {
    let isValid = true;
    const errors = [];
    return { isValid, errors };
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      console.log("Hay errores", errors);
      return;
    } else {
      saveFileLink({
        url,
        type: fileType,
        description: fileDescription,
      });
    }
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={fileDescription}
              onChange={(e) => {
                setFileDescription(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Tipo de archivo</Form.Label>
            <Form.Control
              as="select"
              value={fileType}
              onChange={(e) => {
                setFileType(e.target.value);
              }}
            >
              <option value=""></option>
              <option value="xls">Excel</option>
              <option value="doc">Word</option>
              <option value="pdf">PDF</option>
              <option value="zip">Zip</option>
              <option value="folder">Carpeta</option>
              <option value="file">Otro formato</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Url</Form.Label>
            <Form.Control
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            ></Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button type="submit">Agregar</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FileLinksSection;
