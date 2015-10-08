import { pathValue } from 'falcor-json-graph';

export const RETRIEVE_PATH = 'FALCOR_RETRIEVE_PATH';
export const RETRIEVE_PATHS = 'FALCOR_RETRIEVE_PATHS';
export const RETRIEVE_VALUE = 'FALCOR_RETRIEVE_VALUE';
export const SET_PATH = 'FALCOR_SET_PATH';

export function retrievePath(path) {
  return {
    type: RETRIEVE_PATH,
    falcorPath: path,
    path,
  };
}

export function retrievePaths() {
  const args = Array.prototype.slice.call(arguments);

  return {
    type: RETRIEVE_PATHS,
    falcorPath: args,
    paths: args,
  };
}

export function retrieveValue(path) {
  return {
    type: RETRIEVE_VALUE,
    falcorPath: path,
    path,
  };
}

export function setPath(path, value) {
  return {
    type: SET_PATH,
    falcorPath: pathValue(path, value),
    path,
    value,
  };
}
