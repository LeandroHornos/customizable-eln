import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

/* Firebase */
import { AuthContext } from "./Auth";


// Components
import Dashboard from "./Components/Dashboard";
import Register from "./Components/Register";
import Login from "./Components/Login";
import SignOut from "./Components/SignOut";
import Welcome from "./Components/Welcome";
import TemplateEditor from "./Components/TemplateEditor";

import "./App.css";

function App() {
  // const currentLang = "es";
  const { currentUser } = useContext(AuthContext);
  return (

      <Router>
        <div style={{ boxSizing: "border-box" }}>
          <Switch>
            <Route exact path="/">
              {currentUser ? <Dashboard /> : <Welcome />}
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/exit">
              <SignOut />
            </Route>
            <Route exact path="/template-editor">
              <TemplateEditor />
            </Route>
          </Switch>
        </div>
      </Router>

  );
}

export default App;
