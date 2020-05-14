import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";

export default function Routes() {
    return (
        <Switch>
            <Route path="/" exact component={Home} />
            <Route exact path="/login">
                <Login />
            </Route>
            <Route exact path="/signup">
                <Signup />
            </Route>
            <Route component={NotFound} />
        </Switch>
    );
}
