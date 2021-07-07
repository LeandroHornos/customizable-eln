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

import { peter } from "../demoUsers";

export const Group = () => {
  const user = peter;
  const { id } = useParams();
  const history = useHistory();
  const db = firebaseApp.firestore();
  const [group, setGroup] = useState({});
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtengo el grupo
        let groupSnap = await db.collection("groups").doc(id).get();
        // Si existe el grupo, lo cargo al state y busco los proyectos
        if (groupSnap.exists) {
          groupSnap = { ...groupSnap.data(), id: groupSnap.id };
          setGroup(groupSnap);
          // Cargo los proyectos del grupo
          console.log("voy a buscar este id", groupSnap.id);
          let projSnap = await db
            .collection("projects")
            .where("groupId", "==", groupSnap.id)
            .get();
          if (projSnap) {
            projSnap = projSnap.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            });
            setProjects(projSnap);
            console.log("proyectos:", projSnap);
          } else {
            // Si no hay proyectos:
            console.log("no hay proyectos");
          }
        } else {
          // Si el grupo no existe:
          console.log("El grupo no existe");
        }
        // Habiendo cargado la info, libero la carga de componentes
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    // eslint-disable-next-line
  }, []);

  const saveProject = async (projectData) => {
    const now = new Date();
    let project = {
      ...projectData,
      groupId: id,
      creator: user.id,
      creationDate: now.toLocaleString(),
      creationTimestamp: now.getTime(),
      lastModified: now.getTime(),
      status: "active",
      reports: [],
    };

    try {
      await db.collection("projects").add(project);
      console.log("Proyecto creado con éxito");
      history.push("/blank");
      history.goBack();
    } catch (err) {
      console.log(err);
    }
    console.log("project", project);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          {loading ? (
            <div className="page-spinner-container">
              <SpinnerAndText text="Cargando Grupo..." />
            </div>
          ) : (
            <React.Fragment>
              <GroupInfo group={group} />
              <Button
                variant="link"
                onClick={() => {
                  history.push(`/templates/new/group/${group.id}`);
                }}
              >
                Nueva Plantilla
              </Button>
              <h2>Proyectos</h2>
              <NewProjectCard saveProject={saveProject} />
              <ProjectTable projects={projects} id={id} />
            </React.Fragment>
          )}
        </div>
        <div className="col-md-1"></div>
      </div>
    </React.Fragment>
  );
};

export const GroupInfo = (props) => {
  const { group } = props;
  return (
    <React.Fragment>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
    </React.Fragment>
  );
};

export const ProjectsList = (props) => {
  const history = useHistory();
  const { projects, id } = props;
  return (
    <React.Fragment>
      {projects.length > 0 ? (
        projects.map((project) => {
          return (
            <Card key={project.id} className="project-card">
              <Card.Header
                style={{ padding: "5px" }}
                className="project-card-header"
              >
                <Card.Title className="project-card-title">
                  {project.name}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <h4>CÓDIGO: {project.code}</h4>

                <p>{project.description}</p>
              </Card.Body>
              <Button
                variant="outline-dark"
                onClick={(e) => {
                  history.push(`/group/${id}/project/${project.id}`);
                }}
              >
                Ver
              </Button>
            </Card>
          );
        })
      ) : (
        <p>No hay proyectos</p>
      )}
    </React.Fragment>
  );
};

export const ProjectTable = (props) => {
  const history = useHistory();
  const { projects, id } = props;
  return (
    <React.Fragment>
      <Table>
        <thead>
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Link</th>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => {
              return (
                <tr key={project.id}>
                  <td>{project.code}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>
                    <Button
                      variant="link"
                      onClick={() => {
                        history.push(`/group/${id}/project/${project.id}`);
                      }}
                    >
                      ver
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <p>No hay proyectos</p>
          )}
        </tbody>
      </Table>
    </React.Fragment>
  );
};

export const NewProjectForm = (props) => {
  const { saveProject } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = () => {
    setSaving(true);
    saveProject({ code, name, description });
    console.log("submit");
    setSaving(false);
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Form.Group>
        <Form.Label>Código</Form.Label>
        <Form.Control
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Nombre:</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>
      <Button type="submit">
        {saving ? "Guardando..." : "Crear Proyecto"}
      </Button>
    </Form>
  );
};

export const NewProjectCard = (props) => {
  const { saveProject } = props;
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <Card className="group-card new-group-card">
      <Card.Title className="new-group-card-title">Nuevo Proyecto</Card.Title>
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
              ? "Haz click aquí para crear un nuevo proyecto"
              : "Cancelar"}
          </Button>
        </Card.Text>
        {showNewForm && <NewProjectForm saveProject={saveProject} />}
      </Card.Body>
    </Card>
  );
};

export default Group;
