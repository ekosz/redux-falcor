import { pathValue } from 'falcor-json-graph';

export const RETRIEVE_PATH = 'redux-falcor/falcor/RETRIEVE_PATH';
export const RETRIEVE_PATHS = 'redux-falcor/faclor/RETRIEVE_PATHS';
export const RETRIEVE_VALUE = 'redux-falcor/faclor/RETRIEVE_VALUE';
export const SET_PATH = 'redux-falcor/faclor/SET_PATH';
export const CALL_PATH = 'redux-falcor/faclor/CALL_PATH';

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
  let falcorPath;

  if (!Array.isArray(path) && typeof path === 'object') {
    // path is a JSONEnvelope
    falcorPath = path;
  } else {
    falcorPath = pathValue(path, value);
  }

  return {
    type: SET_PATH,
    falcorPath,
    path,
    value,
  };
}

export function callPath(path, args, refPaths, thisPaths) {
  return {
    type: CALL_PATH,
    falcorPath: path,
    path,
    args,
    refPaths,
    thisPaths,
  };
}
