import React, { useState, useEffect } from "react";

//React Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

// React router
import { useHistory } from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

// Components

import SpinnerAndText from "./SpinnerAndText";


// Dev
import { peter } from "../demoUsers";

export const Groups = () => {
  const uid = peter.id;
  const db = firebaseApp.firestore();
  const [saving, setSaving] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let snapshot = await db
          .collection("groups")
          .where("users", "array-contains", uid)
          .get();

        snapshot = snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setGroups(snapshot);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const saveGroup = async (groupData) => {
    setSaving(true);
    // Genero algunos datos mas
    const now = new Date();
    const roles = {};
    // Creo el objeto "roles" con el id del creador como primera key
    roles[uid] = "full";
    // Genero el objeto con la info del documento
    const group = {
      ...groupData,
      creator: uid,
      ceationDate: now.toLocaleString(),
      creationTimestamp: now.getTime(),
      users: [uid],
      roles,
      projects: [],
      type: "private",
      status: "active",
    };
    // Guardo en base de datos
    try {
      await db.collection("groups").add(group);
      console.log("success");
      setSaving(false);
    } catch (err) {
      console.log(err);
      setSaving(false);
    }
  };
  return (
    <React.Fragment>
      {loading ? (
        <div className="page-spinner-container">
          <SpinnerAndText text="cargando grupos..." />
        </div>
      ) : (
        <GroupList groups={groups} saveGroup={saveGroup} saving={saving} />
      )}
    </React.Fragment>
  );
};

export const NewGroupForm = (props) => {
  const { saveGroup, saving } = props;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const validateForm = () => {
    let isValid = true;
    const errors = [];
    if (name === "") {
      isValid = false;
      errors.push({ type: "error", msg: "Debes asignarle un nombre al grupo" });
    }
    if (description === "") {
      isValid = false;
      errors.push({
        type: "error",
        msg: "Debes dar una descripción que identifique al grupo",
      });
    }
    // Validar los datos en la variables del state
    return { isValid, errors };
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      console.log(errors);
    } else {
      saveGroup({ name, description });
    }
  };

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Form.Group>
        <Form.Label>Nombre</Form.Label>
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
        {saving ? "Creando Grupo..." : "Crear grupo"}
      </Button>
    </Form>
  );
};

export const GroupList = (props) => {
  const history = useHistory();
  const { groups, saveGroup, saving } = props;
  const [showNewForm, setShowNewForm] = useState(false);

  return (
    <React.Fragment>
      <Card className="group-card new-group-card">
        <Card.Title className="new-group-card-title">Nuevo Grupo</Card.Title>
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
                ? "Haz click aquí para crear un nuevo grupo"
                : "Cancelar"}
            </Button>
          </Card.Text>
          {showNewForm && (
            <NewGroupForm saveGroup={saveGroup} saving={saving} />
          )}
        </Card.Body>
      </Card>
      {groups.map((group) => {
        return (
          <button
            className="group-card-btn-wrap"
            style={{ width: "100%" }}
            key={group.id}
            onClick={() => {
              history.push(`/groups/group/${group.id}`);
            }}
          >
            <Card className="group-card">
              <Card.Title className="group-card-title">{group.name}</Card.Title>
              <Card.Body className="group-card-body">
                <Card.Text className="group-card-text">
                  {group.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </button>
        );
      })}
    </React.Fragment>
  );
};

export default Groups;
