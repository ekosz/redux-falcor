import { pathValue } from 'falcor-json-graph';

export const RETRIEVE_PATH = 'redux-falcor/falcor/RETRIEVE_PATH';
export const RETRIEVE_PATHS = 'redux-falcor/faclor/RETRIEVE_PATHS';
export const RETRIEVE_VALUE = 'redux-falcor/faclor/RETRIEVE_VALUE';
export const SET_PATH = 'redux-falcor/faclor/SET_PATH';
export const SET_PATHS = 'redux-falcor/faclor/SET_PATHS';
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
  return {
    type: SET_PATH,
    falcorPath: pathValue(path, value),
    path,
    value,
  };
}

export function setPaths() {
  const args = Array.prototype.slice.call(arguments);

  return {
    type: SET_PATHS,
    falcorPath: args,
    paths: args,
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
