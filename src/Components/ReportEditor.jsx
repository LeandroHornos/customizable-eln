import React, { useState, useEffect, useContext } from "react";

import firebaseApp from "../firebaseApp";

import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Table from "react-bootstrap/Table";

// Components
import NavigationBar from "./NavigationBar";

import { useParams, useHistory } from "react-router-dom";

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
              <TextSection section={report.sections[1]}/>
              <TableSection section={report.sections[3]} />
            </div>
            <div className="col-md-1"></div>
          </div>
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
  let { layout, name, description } = props.section;
  return (
    <React.Fragment>
      <h3 className="color-2">{name}</h3>
      <p>{description}</p>
      <div className="table-container">
        <Table>
          <tr>
            {layout.columns.map((col) => {
              return <th key={col.id}>{col.name}</th>;
            })}
          </tr>
          <tr>
            {layout.columns.map((col) => {
              return <td key={`${col.id}-row-0`}>Empty</td>;
            })}
          </tr>
        </Table>
      </div>
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
