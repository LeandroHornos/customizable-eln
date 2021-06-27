import React, { useEffect, useState } from "react";

// Firebase
import firebaseApp from "../firebaseApp";

// React Router
import { useHistory } from "react-router-dom";

// React Bootstrap
import Table from "react-bootstrap/Table";

// Components
import NavigationBar from "./NavigationBar";
import SpinnerAndText from "./SpinnerAndText";

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
      console.log("reports:", reps);
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
            <SpinnerAndText text="cargando reportes..." />
          ) : (
            <ReportsInfoTable reports={reports} />
          )}
        </div>
        <div className="col-md-2"></div>
      </div>
    </React.Fragment>
  );
};

export const ReportsInfoTable = (props) => {
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

export default Reports;
