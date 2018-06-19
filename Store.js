//import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import AppReducers from './AppReducers';

import { applyMiddleware, createStore } from 'redux';
//import createSagaMiddleware from 'redux-saga';

//import * as reducers from './reducer';
//import sagas from './src/test-image/saga';

//const sagaMiddleware = createSagaMiddleware();

const middleware = [
  //sagaMiddleware,
  ReduxThunk
];

const store = createStore(
  AppReducers,
  applyMiddleware(...middleware),
);

//sagaMiddleware.run(sagas);

export default store;