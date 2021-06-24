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

import React, { useState, useEffect } from "react";

import firebaseApp from "../firebaseApp";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";

// Components
import NavigationBar from "./NavigationBar";
import SpinnerAndText from "./SpinnerAndText";
import TableSection from "./TableSection";
import TextSection from "./TextSection";
import FileLinksSection from "./FileLinksSection";
import JournalSection from "./JournalSection";

import { useParams } from "react-router-dom";

export const ReportEditor = () => {
  const { id } = useParams();
  const db = firebaseApp.firestore();
  const [report, setReport] = useState({});
  const [sections, setSections] = useState([]);
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
        let sects = await db
          .collection("reports")
          .doc(id)
          .collection("sections")
          .get();
        rep = { ...rep.data(), id: rep.id };
        sects = sects.docs.map((sec) => {
          return { ...sec.data(), id: sec.id };
        });
        setReport(rep);
        setSections(sects);
        console.log("Se descargo este reporte", rep);
        console.log("Se descargaron las secciones", sects);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const saveSection = async (sectionObj) => {
    /* Esta funcion se pasa a los componentes para que puedan guardar
    la seccion en el reporte y actualizar la base de datos. Esta función
    permite salvar en el documento los cambios generados localmente en cada
    componente asociado a una sección.  */
    let sectionsCopy = JSON.parse(JSON.stringify(report.sections));
    console.log(
      "Esta es la copia de la seccion que se va a actualizar",
      sectionsCopy[sectionObj.id]
    );
    sectionsCopy[sectionObj.id] = sectionObj;
    console.log("Salvando cambios en la sección", sectionsCopy[sectionObj.id]);
    try {
      await db.collection("reports").doc(id).update({ sections: sectionsCopy });
      console.log("se han guardado los cambios en la base de datos");
      setReport({ ...report, sections: sectionsCopy });
    } catch (error) {
      console.log(error);
    }
    return;
  };

  return (
    <React.Fragment>
      <NavigationBar />
      {loading ? (
        <SpinnerAndText text="cargando..." />
      ) : (
        <React.Fragment>
          <div className="row" style={{ paddingTop: "50px" }}>
            <div className="col-md-1"></div>
            <div className="col-md-5">
              <div>
                <h2 className="color-1-light">
                  <strong>Proyecto:</strong> {report.projectName}
                </h2>
                <h2 className="color-1-light">
                  <small>Reporte: {report.reportNumber}</small>
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
              <ReportNavigator
                sections={JSON.stringify(sections)}
                saveSection={saveSection}
              />
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
  const { saveSection } = props;
  const sections = JSON.parse(props.sections);
  const [activeSection, setActiveSection] = useState("");
  const [sectionsArray, setSectionsArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sections) {
      return <p>No hay secciones</p>;
    }
    const keys = Object.keys(sections);
    const sArray = sections.sort((a, b) => {
      return a.order - b.order;
    });
    setSectionsArray(sArray);
    console.log("Sections array:", sArray);
    setActiveSection(sArray[0].id);
    setLoading(false);
  }, []);
  return (
    <React.Fragment>
      {!loading && (
        <Nav fill variant="tabs" defaultActiveKey={sectionsArray[0].name}>
          {sectionsArray.map((section) => {
            return (
              <Nav.Item key={`nav-${section.id}`}>
                <Nav.Link
                  href="#"
                  eventKey={section.name}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("seteando seccion", section.id);
                    setActiveSection(section.id);
                  }}
                >
                  {section.name}
                </Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      )}
      <SectionSwitch
        sections={sections}
        activeSection={activeSection}
        saveSection={saveSection}
      />
    </React.Fragment>
  );
};

export const SectionSwitch = (props) => {
  const { sections, activeSection, saveSection } = props;
  const sectionsObject = {};
  sections.forEach((sect) => {
    sectionsObject[sect.id] = { ...sect };
  });
  if (activeSection === "") {
    return <div></div>;
  }

  const section = sectionsObject[activeSection];
  console.log("SectionsSwitch dice: esta es la sección", section);
  switch (section.component) {
    case "table":
      return (
        <TableSection
          section={JSON.stringify(section)}
          saveSection={saveSection}
        />
      );
    case "text":
      return (
        <TextSection
          section={JSON.stringify(section)}
          saveSection={saveSection}
        />
      );
    case "form":
      return (
        <FormSection
          section={JSON.stringify(section)}
          saveSection={saveSection}
        />
      );
    case "file-links":
      return (
        <FileLinksSection
          section={JSON.stringify(section)}
          saveSection={saveSection}
        />
      );
    case "journal":
      return (
        <JournalSection
          section={JSON.stringify(section)}
          saveSection={saveSection}
        />
      );
    default:
      return <div></div>;
  }
};

// SECTION EDITORS:

export const FormSection = (props) => {
  const section = JSON.parse(props.section);
  let { layout, name, description } = section;

  return (
    <React.Fragment>
      <h3 className="color-2 section-title">{name}</h3>
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

export default ReportEditor;
