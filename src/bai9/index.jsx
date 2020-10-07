import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import SignUp from "../bai10/SignUp";
import UserPage from "../bai10/UserPage";
import Bai8 from "../bai8";
import AdminPage from "./component/AdminPage";
import SignIn from "./component/SignIn";

function Bai9(props) {
  return (
    <div className="container">
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/sign-in" />
          <Route path="/admin" component={AdminPage} />
          <Route path="/user" component={UserPage} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/game" component={Bai8} />
          <Route component={() => <div>Oops ... Not found</div>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Bai9;
