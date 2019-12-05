import React from "react";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import Identification from "./pages/Identification";
import Login from "./components/Login";
import Signin from "./components/Signin";
import HomePage from "./components/HomePage";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/identification" component={Identification} />
        <Route path="/login" component={Login} />
        <Route path="/signin" component={Signin} />
      </Switch>
      <HomePage />
      <NavBar />
    </div>
  );
}

export default App;
