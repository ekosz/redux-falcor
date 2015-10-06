import merge from 'deepmerge';
import { RETRIEVE_PATH, SET_PATH } from './actions';

const initialState = {};

export default function falcorReducer(state = initialState, action) {
  switch (action.type) {
  case RETRIEVE_PATH:
  case SET_PATH:
    return merge(state, action.res.json);
  default:
    return state;
  }
}
