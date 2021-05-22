import React, { useState, useEffect } from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

//Router
import {useHistory} from "react-router-dom";

// Firebase
import firebaseApp from "../firebaseApp";

// Components
import NavigationBar from "./NavigationBar";

const StartNewReport = () => {
  const history = useHistory();
  const db = firebaseApp.firestore();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let data = await db.collection("templates").get();
      data = data.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setTemplates(data);
      setSelectedTemplate(data[0].id);
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

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
    const now = new Date();
    const { isValid, errors } = validateForm();
    if (isValid) {
      const temp = getTemplateById(selectedTemplate);
      let report = {
        sections: temp.sections,
        templateId: selectedTemplate,
        creatorId: "",
        creationDateString: `${now.getDate()}-${
          now.getMonth() + 1
        }-${now.getFullYear()}`,
        creationTimestamp: now.getTime(),
        closingTimestamp: "",
        closingDateString: "",
        lastEditTimestamp: now.getTime(),
        status: "active",
        comments: [],
        projectId: "",
        projectName:"",
        reportNumber: 0,
      };
      console.log(report);
      try {
        await db.collection("reports").add(report);
        console.log("se ha creado el reporte con éxito");
        history.push("/");
      } catch (error) {
        console.log(error);
      }
    } else console.log(errors);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h1 className="text-center">Nuevo reporte</h1>
          {!loading && (
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
              <Button block type="select">
                Crear reporte
              </Button>
            </Form>
          )}
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default StartNewReport;
