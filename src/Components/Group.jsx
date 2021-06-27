import React, { useState, useEffect } from "react";

//React Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// React router
import { useHistory, useParams } from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

// Components
import NavigationBar from "./NavigationBar";

import { peter } from "../demoUsers";

const Group = () => {
  const user = peter;
  const { id } = useParams();
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
          let projSnap = await db
            .collection("groups")
            .doc(groupSnap.id)
            .collection("projects")
            .get();
          if (projSnap.exists) {
            projSnap = projSnap.docs.map((doc) => {
              return { ...doc.data(), id: doc.id };
            });
            setProjects(projSnap);
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
  }, []);

  const saveProject = async (projectData) => {
    const now = new Date();
    let project = {
      ...projectData,
      creator: user.id,
      creationDate: now.toLocaleString(),
      creationTimestamp: now.getTime(),
      lastModified: now.getTime(),
      status: "active",
      reports: [],
    };

    try {
      await db.collection("groups").doc(id).collection("projects").add(project);
      console.log("Proyecto creado con éxito");
    } catch (err) {
      console.log(err);
    }
    console.log("project", project);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {loading ? "Cargando" : <GroupInfo group={group} />}
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          {!loading && <ProjectsList projects={projects} />}
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h2>Nuevo proyecto</h2>
          {!loading && <NewProjectForm saveProject={saveProject} />}
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export const GroupInfo = (props) => {
  const { group } = props;
  return (
    <React.Fragment>
      <h2>{group.name}</h2>
      <p>{group.description}</p>
    </React.Fragment>
  );
};

export const ProjectsList = (props) => {
  const { projects } = props;
  return (
    <React.Fragment>
      <h2>Proyectos</h2>
      {projects.length > 0 ? <p>Hay proyectos</p> : <p>No hay proyectos</p>}
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
        {saving ? "Creando Proyecto..." : "Crear Proyecto"}
      </Button>
    </Form>
  );
};

export default Group;
