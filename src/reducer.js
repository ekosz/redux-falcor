import merge from 'deepmerge';
import {
  RETRIEVE_VALUE,
  RETRIEVE_PATH,
  RETRIEVE_PATHS,
  SET_PATH,
  SET_PATHS,
  CALL_PATH,
  CLEAR,
} from './actions';

function endsWith(subjectString, searchString) {
  let position = subjectString.length;
  position -= searchString.length;
  const lastIndex = subjectString.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

const initialState = {loading: false};

export default function falcorReducer(state = initialState, action) {
  if (endsWith(action.type, '_REQUEST')) {
    return {...state, loading: true };
  }

  if (endsWith(action.type, '_FAILURE')) {
    return {...state, loading: false };
  }

  switch (action.type) {
  case RETRIEVE_VALUE:
    return {...state, loading: false };

  case RETRIEVE_PATH:
  case RETRIEVE_PATHS:
  case SET_PATH:
  case SET_PATHS:
  case CALL_PATH:
    const newState = {...state, loading: false};
    if (!action.res) return newState;
    return merge(newState, action.res.json);

  case CLEAR:
    const { loading } = state;
    return { loading };

  default:
    return state;
  }
}
