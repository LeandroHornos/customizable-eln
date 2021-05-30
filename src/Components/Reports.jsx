import React, { useEffect, useState } from "react";

import NavigationBar from "./NavigationBar";
import SpinnerAndText from "./SpinnerAndText";

import firebaseApp from "../firebaseApp";

import { useHistory } from "react-router-dom";

const Reports = () => {
  const db = firebaseApp.firestore();
  const history = useHistory();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let reps = await db.collection("reports").get();
      reps = reps.docs.map((rep) => {
        return { ...rep.data(), id: rep.id };
      });
      setReports(reps);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <h1 className="text-center">Reportes</h1>
          {loading ? (
            <SpinnerAndText text="cargando reportes..."/>
          ) : (
            <ul>
              {reports.map((rep) => {
                return (
                  <li key={rep.id}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("vamo a", `/report/${rep.id}`);
                        history.push(`/report/${rep.id}`);
                      }}
                    >
                      {rep.id}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export default Reports;
