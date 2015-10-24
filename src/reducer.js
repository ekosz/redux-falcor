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

const initialState = {loading: false};

export default function falcorReducer(state = initialState, action) {
  switch (action.type) {
  case (RETRIEVE_VALUE + '_REQUEST'):
  case (RETRIEVE_PATH + '_REQUEST'):
  case (RETRIEVE_PATHS + '_REQUEST'):
  case (SET_PATH + '_REQUEST'):
  case (SET_PATHS + '_REQUEST'):
  case (CALL_PATH + '_REQUEST'):
    return {...state, loading: true };

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

  case (RETRIEVE_VALUE + '_FAILURE'):
  case (RETRIEVE_PATH + '_FAILURE'):
  case (RETRIEVE_PATHS + '_FAILURE'):
  case (SET_PATH + '_FAILURE'):
  case (SET_PATHS + '_FAILURE'):
  case (CALL_PATH + '_FAILURE'):
    return {...state, loading: false };

  case CLEAR:
    const { loading } = state;
    return { loading };

  default:
    return state;
  }
}
