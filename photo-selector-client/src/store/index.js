import { applyMiddleware, createStore, compose } from 'redux';

import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

import monitorReducerEnhancer from './support/enhancers/monitorReducer';

import logger from './support/middleware/logger';

import rootReducer from './reducers';

import history from './history';

const configureStore = (preloadedState) => {

  const middleware = [logger, thunk];
  const middlewareEnhancer = compose(applyMiddleware(...middleware));

  const enhancers = [middlewareEnhancer, monitorReducerEnhancer];
  const composedEnhancers = composeWithDevTools(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.REACT_APP_ENVIRONMENT !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return { store, history };
};

export default configureStore;