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

function App() {
  // const currentLang = "es";
  return (
    <Router>
      <div style={{ boxSizing: "border-box" }}>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route exact path="/template-editor">
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
