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

function omit(object, key) {
  const { [key]: _old, ...rest } = object;
  return rest;
}

const initialState = {loading: false, _requests: {}};

export default function falcorReducer(state = initialState, action) {
  const { loading: loading = false, _requests: _requests = {} } = state;

  if (endsWith(action.type, '_REQUEST')) {
    return {...state, loading: true, _requests: {..._requests, [action._id]: true} };
  }

  if (endsWith(action.type, '_FAILURE') || action.type === RETRIEVE_VALUE) {
    const requests = omit(_requests, action._id);
    return {...state, loading: Object.keys(requests).length !== 0, _requests: requests };
  }

  switch (action.type) {
  case RETRIEVE_PATH:
  case RETRIEVE_PATHS:
  case SET_PATH:
  case SET_PATHS:
  case CALL_PATH:
    const requests = omit(_requests, action._id);
    const newState = {...state, loading: Object.keys(requests).length !== 0, _requests: requests};
    if (!action.res) return newState;
    return merge(newState, action.res.json);

  case CLEAR:
    return { loading, _requests };

  default:
    return state;
  }
}
