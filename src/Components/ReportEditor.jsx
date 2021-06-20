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

import { useParams, useHistory } from "react-router-dom";

export const ReportEditor = () => {
  const { id } = useParams();
  const db = firebaseApp.firestore();
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
        console.log("Se descargo este reporte", rep);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  // const convertSectionsArrayIntObject = async () => {
  //   let sectionsArray = JSON.parse(JSON.stringify(report.sections));
  //   let sectionObject = {};
  //   sectionsArray.forEach((sect) => {
  //     sectionObject[sect.id] = sect;
  //   });
  //   console.log("Se han convertido las secciones en un objeto", sectionObject);
  //   try {
  //     await db
  //       .collection("reports")
  //       .doc(id)
  //       .update({ sections: sectionObject });
  //     console.log("se ha actualizado con exito el reporte");
  //   } catch (err) {
  //     console.log(
  //       "Ha ocurrido un error al querer guadar el objeto secciones en la base de datos",
  //       err
  //     );
  //   }
  // };

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
      <div className="row">
        <div className="col-12">
          <h1 className="text-center" style={{ paddingBottom: "40px" }}>
            Reporte
          </h1>
        </div>
      </div>
      {loading ? (
        <SpinnerAndText text="cargando..." />
      ) : (
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
              <ReportNavigator
                sections={JSON.stringify(report.sections)}
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

    let sArray = keys.map((id) => {
      return {
        id,
        order: sections[id].order,
        name: sections[id].name,
        type: sections[id].type,
      };
    });

    sArray = sArray.sort((a, b) => {
      return a.order - b.order;
    });
    setSectionsArray(sArray);
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
  if (activeSection === "") {
    return <div></div>;
  }

  const section = sections[activeSection];
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
      return <TextSection section={section} saveSection={saveSection} />;
    case "form":
      return <FormSection section={section} saveSection={saveSection} />;
    default:
      return <div></div>;
  }
};

// SECTION EDITORS:

export const FormSection = (props) => {
  let { layout, name, description } = props.section;

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

/* TEXT SECTION ------------------------------------- */

export const TextSection = (props) => {
  let { layout, name, description } = props.section;
  return (
    <React.Fragment>
      <h3 className="color-2 section-title">{name}</h3>
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
