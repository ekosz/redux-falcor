import { createStore, combineReducers } from 'redux';
import { reducer as falcorReducer } from '../../src/index.js';

const reducers = combineReducers({
  falcor: falcorReducer
});

export const store = createStore(reducers);
