import React, { useState, useEffect } from "react";

//React Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";

// React router
import { useHistory, useParams } from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

// Components
import NavigationBar from "./NavigationBar";
import SpinnerAndText from "./SpinnerAndText";

// Functions
import { checkObj } from "../utilities";

export const Project = () => {
  const { gid, pid } = useParams();
  const db = firebaseApp.firestore();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("buscando proyecto", pid);
        let snapProject = await db.collection("projects").doc(pid).get();
        if (snapProject) {
          snapProject = { ...snapProject.data(), id: snapProject.id };
          setProject(snapProject);
          console.log("Se ha encontrado el proyecto", snapProject);
          setLoading(false);
        }
      } catch (err) {
        console.log("Ha ocurrido un error", err);
      }
    };

    fetchData();
  }, []);
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {loading ? <p>Cargando</p> : <ProjectInfo project={project} />}
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">{loading && "pepito"}</div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export const ProjectInfo = (props) => {
  const { project } = props;
  const { exists, isEmpty } = checkObj(project);

  if (!exists || isEmpty) {
    return <p>No se ha encontrado el proyecto</p>;
  } else {
    return (
      <React.Fragment>
        <h1>{project.name}</h1>
        <h2>{project.code}</h2>
        <p>{project.description}</p>
      </React.Fragment>
    );
  }
};

export const NewReportForm = (props) => {
  const db = firebaseApp.firestore();
  const { templates, uid, gid, pid } = props;
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [reportNumber, setReportNumber] = useState(0);
  const [description, setDescription] = useState("");

  const validateForm = () => {
    return { isValid: true, errors: [] };
  };

  const getTemplateById = (id) => {
    console.log("Tengo este id", id);
    let results = templates.filter((temp) => {
      console.log("comparo con,", temp.id);
      return temp.id === id;
    });
    console.log("encontre estos resultados", results);
    return results[0];
  };

  const handleSubmit = async () => {
    const batch = db.batch();
    const now = new Date();
    const { isValid, errors } = validateForm();
    if (isValid) {
      const temp = getTemplateById(selectedTemplate);
      let report = {
        templateId: selectedTemplate,
        version: 0,
        creatorId: uid,
        creationDate: now,
        creationTimestamp: now.getTime(),
        closingTimestamp: "",
        closingDate: "",
        lastEditTimestamp: now.getTime(),
        lastEditDate: now,
        status: "active",
        comments: [],
        projectId: pid,
        groupId: gid,
        projectName,
        reportNumber,
        description,
      };
      console.log(report);
      try {
        // Creo el reporte en la base de datos
        const rep = await db.collection("reports").add(report);
        console.log("se ha creado el reporte con éxito, id:", rep.id);
        // Creo la subcoleccion de secciones
        temp.sections.forEach((doc) => {
          var docRef = db
            .collection("reports")
            .doc(rep.id)
            .collection("sections")
            .doc(); // Generar el id automaticamente
          batch.set(docRef, doc);
        });
        await batch.commit();
        console.log("Se guardaron las secciones!");
      } catch (error) {
        console.log(error);
      }
    } else console.log(errors);
  };

  return (
    <React.Fragment>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Form.Group>
          <Form.Label>Elije una plantilla</Form.Label>
          <Form.Control
            as="select"
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
            }}
          >
            {templates.map((temp) => {
              return (
                <option value={temp.id} key={temp.id}>
                  {temp.name}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Proyecto</Form.Label>
          <Form.Control
            value={projectName}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Numero de reporte</Form.Label>
          <Form.Control
            type="number"
            value={reportNumber}
            onChange={(e) => {
              setReportNumber(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Descripción breve</Form.Label>
          <Form.Control
            as="textarea"
            rows="2"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Button block type="select">
          Crear reporte
        </Button>
      </Form>
    </React.Fragment>
  );
};

export const ReportList = (props) => {
  const history = useHistory();
  const { reports } = props;
  return (
    <Table>
      <thead>
        <th>Proyecto</th>
        <th>Reporte Nro</th>
        <th>Descripción</th>
        <th>Estado</th>
        <th>Link</th>
      </thead>
      <tbody>
        {reports.map((rep) => {
          return (
            <tr key={rep.id}>
              <td>{rep.projectName}</td>
              <td>{rep.reportNumber}</td>
              <td>{rep.description}</td>
              <td>{rep.status}</td>
              <td>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/report/${rep.id}`);
                  }}
                >
                  Ver
                </a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Project;
