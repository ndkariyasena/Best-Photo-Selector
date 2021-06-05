import React, { Suspense, useEffect } from 'react';

import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import BasicLayout from './layout/Basic';

import { Router, Route, Switch } from 'react-router-dom';

import routes from './routes';

import LoadingView from './components/Loading';

import LandingPage from './views/Landing';

import { getUserDetails } from './store/actions/User.actions';

import './assets/styles/common.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = (props) => {


  /* Run at the page load */
  useEffect(() => {

    try {

      const getUserDetails = async () => {
        /* Get user details */
        await props.getUserDetails();
      };

      /* Get data */
      getUserDetails();

    } catch (error) {
      console.log(error);
    }

  }, []);

  return (
    <Router history={props.history}>
      <Suspense fallback={LoadingView}>
        <BasicLayout>
          <LandingPage >
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
          </LandingPage>
        </BasicLayout>
      </Suspense>
    </Router>
  );
};

App.defaultProps = {
};

App.propTypes = {
  history: PropTypes.any.isRequired,
  authUser: PropTypes.object.isRequired,
  getUserDetails: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  authUser: state.PhotoRepo.author,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getUserDetails: () => dispatch(getUserDetails()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
