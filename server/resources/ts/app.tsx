import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import { Top } from "./views/Top";
import { Register } from "./views/Register";
import { Login } from "./views/Login";
import { Home } from "./views/Home";
import ProvideAuth, { PrivateRoute, PublicRoute } from "./views/AuthContext";

export const App = () => {
  return (
    <ProvideAuth>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" exact><Top /></Route>
            <PublicRoute path="/register" exact><Register /></PublicRoute>
            <PublicRoute path="/login" exact><Login /></PublicRoute>
            <PrivateRoute path="/home" exact><Home /></PrivateRoute>
          </Switch>
        </div>
      </BrowserRouter>
    </ProvideAuth>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
