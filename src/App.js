import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

// Components
import Dashboard from "./Components/Dashboard";
import TemplateEditor from "./Components/TemplateEditor";
import StartNewReport from "./Components/StartNewReport";

import "./App.css";

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
        </Switch>
      </div>
    </Router>
  );
}

export default App;
