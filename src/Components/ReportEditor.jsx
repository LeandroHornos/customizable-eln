import React, { useState, useEffect } from "react";

import firebaseApp from "../firebaseApp";

// Components
import NavigationBar from "./NavigationBar";

import { useParams, useHistory } from "react-router-dom";

const ReportEditor = () => {
  const { id } = useParams();
  const db = firebaseApp.firestore();
  const history = useHistory();
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
        setReport({ ...rep.data(), id: rep.id });
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);
  
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="roe">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h1 className="text-center">Reporte</h1>
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default ReportEditor;
