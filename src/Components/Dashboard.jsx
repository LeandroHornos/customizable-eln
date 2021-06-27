import React, { useContext } from "react";

import { useHistory } from "react-router-dom";

// React Bootstrap
import Button from "react-bootstrap/Button";

// Components
import NavigationBar from "./NavigationBar";

// Dev
import { peter } from "../demoUsers";

const Dashboard = () => {
  const history = useHistory();
  const user = { ...peter };
  return (
    <React.Fragment>
      <NavigationBar />
      <div className="row row-custom-settings min-h-80">
        <div className="col-md-3"></div>
        <div className="col-md-6">
          <div className="center-col-container">
            <h1 className="text-center">Inicio</h1>
            <Button
              block
              onClick={() => {
                history.push("/template-editor");
              }}
            >
              Editar plantillas
            </Button>
            <Button
              block
              onClick={() => {
                history.push("/new-report");
              }}
            >
              Nuevo Reporte
            </Button>
            <Button
              block
              onClick={() => {
                history.push("/reports");
              }}
            >
              Mis reportes
            </Button>
            <Button
              block
              onClick={() => {
                history.push(`/groups/user/${user.id}`);
              }}
            >
              Mis Grupos
            </Button>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
