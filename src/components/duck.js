const UPDATE = 'redux-falcor/UPDATE';

export default function reduxFalcorReducer(state = {}, action) {
  switch (action.type) {
  case UPDATE:
    return { ...action.payload };
  default:
    return state;
  }
}

export function updateFalcorCache(falcorCache) {
  return {
    type: UPDATE,
    payload: falcorCache
  };
}
