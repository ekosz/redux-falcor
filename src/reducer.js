import merge from 'deepmerge';
import { RETRIEVE_PATH, RETRIEVE_PATHS, SET_PATH, CALL_PATH } from './actions';

const initialState = {};

export default function falcorReducer(state = initialState, action) {
  switch (action.type) {
  case RETRIEVE_PATH:
  case RETRIEVE_PATHS:
  case SET_PATH:
  case CALL_PATH:
    return merge(state, action.res.json);
  default:
    return state;
  }
}
