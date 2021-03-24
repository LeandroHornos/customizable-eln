import React, { useContext, useState, useEffect } from "react";

// Router
import { useHistory } from "react-router-dom";

// Context
import { LanguageContext } from "../Lang";
import { AuthContext } from "../Auth";

// Firebase
import firebaseApp from "../firebaseApp";

// React Bootstrap Components
import Button from "react-bootstrap/Button";

// Components
import NavigationBar from "./NavigationBar";

const TemplateGallery = () => {
  const db = firebaseApp.firestore();
  const ref = db.collection("templates");

  const history = useHistory();
  const { dictionary } = useContext(LanguageContext);
  const { currentUser } = useContext(AuthContext);
  const txt = dictionary.components.dashboard;

  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("vamos a buscar las plantillas del usuario", currentUser.uid);
      try {
        let results = await ref.where("creatorId", "==", currentUser.uid).get();
        let docs = results.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setTemplates(docs);
        console.log("Se han obtenido las siguientes plantillas", docs);
      } catch (error) {
        console.log(
          "Ha ocurrido un error al intentar obtener las plantillas del usuario:",
          error
        );
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row row-custom-settings min-h-80">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="center-col-container">
            <h1>Template Gallery</h1>
            <Button
              onClick={() => {
                history.push("/template-editor");
              }}
            >
              {txt.templateEditor}
            </Button>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default TemplateGallery;
