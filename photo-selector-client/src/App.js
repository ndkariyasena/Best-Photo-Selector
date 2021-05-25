import React, { Suspense } from 'react';

import BasicLayout from "./layout/Basic";

import { Router, Route, Switch } from "react-router-dom";

import routes from "./routes";

import LoadingView from "./components/Loading";

import 'bootstrap/dist/css/bootstrap.min.css';

function App(props) {
  return (
    <Router history={props.history}>
      <Suspense fallback={LoadingView}>
        <BasicLayout>
          <Switch>
            {
              routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              ))
            }
          </Switch>
        </BasicLayout>
      </Suspense>
    </Router>
  );
}

export default App;
