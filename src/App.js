import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Dashboard from "./Components/Dashboard";
import Groups from "./Components/Groups";
import Group from "./Components/Group";
import TemplateEditor from "./Components/TemplateEditor";
import StartNewReport from "./Components/StartNewReport";
import Reports from "./Components/Reports";
import ReportEditor from "./Components/ReportEditor";
import Project from "./Components/Project";
import Blank from "./Components/Blank"

function App() {
  // const currentLang = "es";
  return (
    <Router>
      <div style={{ boxSizing: "border-box" }}>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/templates/new/group/:gid">
            <TemplateEditor />
          </Route>
          <Route exact path="/new-report">
            <StartNewReport />
          </Route>
          <Route exact path="/reports">
            <Reports />
          </Route>
          <Route exact path="/report/:id">
            <ReportEditor />
          </Route>
          <Route exact path="/groups/user/:uid">
            <Groups />
          </Route>
          <Route exact path="/groups/group/:id">
            <Group />
          </Route>
          <Route exact path="/group/:gid/project/:pid">
            <Project />
          </Route>
          <Route exact path="/blank">
            <Blank />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
