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
import HeadBlock from "./HeadBlock";

// Functions
import { checkObj, checkArray, getTextPreview } from "../utilities";

import { peter } from "../demoUsers";

export const Project = () => {
  const uid = peter.id;
  const { gid, pid } = useParams();
  const db = firebaseApp.firestore();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState({});
  const [group, setGroup] = useState({});
  const [reports, setReports] = useState([]);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtengo el grupo
        let snapGroup = await db.collection("groups").doc(gid).get();
        if (snapGroup) {
          snapGroup = { ...snapGroup.data(), id: snapGroup.id };
          setGroup(snapGroup);
          console.log("Obtuve el grupo", snapGroup);
        }
        // Obtengo proyecto
        let snapProject = await db.collection("projects").doc(pid).get();
        if (snapProject) {
          snapProject = { ...snapProject.data(), id: snapProject.id };
          setProject(snapProject);
          console.log("Obtuve el proyecto", snapProject);
        }
        // Obtengo los reportes
        let snapReports = await db
          .collection("reports")
          .where("projectId", "==", pid)
          .get();
        if (snapReports) {
          snapReports = snapReports.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setReports(snapReports);
          console.log("Obtuve los reportes", snapReports);
        }
        // Obtengo los templates
        let snapTemplates = await db
          .collection("templates")
          .where("groupId", "==", gid)
          .get();
        if (snapTemplates) {
          snapTemplates = snapTemplates.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          });
          setTemplates(snapTemplates);
          console.log("Obtuve los templates", snapTemplates);
        }
        setLoading(false);
      } catch (err) {
        console.log("Ha ocurrido un error", err);
      }
    };

    if (loading) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [loading]);
  return (
    <React.Fragment>
      <NavigationBar />
      {loading ? (
        <div className="page-spinner-container">
          <SpinnerAndText text="Cargando Proyecto..." />
        </div>
      ) : (
        <React.Fragment>
          <ProjectInfo project={project} />
          <div className="row">
            <div className="col-md-1"></div>
            <div className="col-md-10">
              <h2 className="sect-h2">Reportes</h2>
              <NewReportCard
                gid={gid}
                pid={pid}
                uid={uid}
                templates={templates}
                setLoading={setLoading}
              />
              <ReportTable reports={reports} />
            </div>
            <div className="col-md-1"></div>
          </div>
        </React.Fragment>
      )}
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
        <HeadBlock>
          <h1>{project.name}</h1>
          <h2>{project.code}</h2>
          <p>{project.description}</p>
        </HeadBlock>
      </React.Fragment>
    );
  }
};

export const NewReportForm = (props) => {
  const db = firebaseApp.firestore();
  const { templates, uid, gid, pid, setLoading } = props;
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
      console.log("select template", selectedTemplate);
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
        console.log("vamos a guardar estas secciones", temp.sections);
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
        setLoading(true);
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
            <option value="">Elije una plantilla</option>
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

export const NewReportCard = (props) => {
  const { gid, pid, uid, templates, setLoading } = props;
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <Card className="group-card new-group-card">
      <Card.Title className="new-group-card-title">Nuevo Reporte</Card.Title>
      <Card.Body className="group-card-body">
        <Card.Text className="new-group-card-text">
          <Button
            style={{
              padding: "0px",
              color: showNewForm ? "rgb(250,80,50)" : "rgb(150,180,250)",
            }}
            variant="link"
            onClick={() => {
              setShowNewForm(!showNewForm);
            }}
          >
            {!showNewForm
              ? "Haz click aquí para crear un nuevo reporte"
              : "Cancelar"}
          </Button>
        </Card.Text>
        {showNewForm && (
          <NewReportForm
            gid={gid}
            pid={pid}
            uid={uid}
            templates={templates}
            setLoading={setLoading}
          />
        )}
      </Card.Body>
    </Card>
  );
};

export const ReportTable = (props) => {
  const history = useHistory();
  const { reports } = props;
  const { exists, isEmpty } = checkArray(reports);
  if (!exists || isEmpty) {
    return <p>No hay reportes</p>;
  } else {
    return (
      <div style={{ overflowX: "auto" }}>
        <Table>
          <thead>
            <th>Reporte Nro</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Link</th>
          </thead>
          <tbody>
            {reports.map((rep) => {
              return (
                <tr key={rep.id}>
                  <td>{rep.reportNumber}</td>
                  <td>{getTextPreview(rep.description, 100)}</td>
                  <td>{rep.status}</td>
                  <td>
                    <Button
                      style={{ padding: "0px" }}
                      variant="link"
                      onClick={() => {
                        history.push(`/report/${rep.id}`);
                      }}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
};

export default Project;
