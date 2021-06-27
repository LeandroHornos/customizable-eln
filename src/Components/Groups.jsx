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

const Groups = () => {
  const { uid } = useParams();
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
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h1>Mis Grupos</h1>
          {!loading && <GroupList groups={groups} />}
        </div>
        <div className="col-md-2"></div>
      </div>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h2>Nuevo Grupo</h2>
          <NewGroupForm saveGroup={saveGroup} saving={saving} />
        </div>
        <div className="col-md-2"></div>
      </div>
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
  const { groups } = props;

  return (
    <React.Fragment>
      {groups.map((group) => {
        return (
          <Card key={group.id}>
            <Card.Title>{group.name}</Card.Title>
            <Card.Body>{group.description}</Card.Body>
            <Button
              onClick={() => {
                history.push(`/groups/group/${group.id}`);
              }}
            >
              Ver Grupo
            </Button>
          </Card>
        );
      })}
    </React.Fragment>
  );
};
export default Groups;
