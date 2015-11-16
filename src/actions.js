import { pathValue } from 'falcor-json-graph';
import uuid from 'tiny-uuid';

export const RETRIEVE_PATH = 'redux-falcor/falcor/RETRIEVE_PATH';
export const RETRIEVE_PATHS = 'redux-falcor/falcor/RETRIEVE_PATHS';
export const RETRIEVE_VALUE = 'redux-falcor/falcor/RETRIEVE_VALUE';
export const SET_PATH = 'redux-falcor/falcor/SET_PATH';
export const SET_PATHS = 'redux-falcor/falcor/SET_PATHS';
export const CALL_PATH = 'redux-falcor/falcor/CALL_PATH';
export const CLEAR = 'redux-falcor/falcor/CLEAR';

export function retrievePath(path) {
  return {
    _id: uuid(),
    type: RETRIEVE_PATH,
    falcorPath: path,
    path,
  };
}

export function retrievePaths() {
  const args = Array.prototype.slice.call(arguments);

  return {
    _id: uuid(),
    type: RETRIEVE_PATHS,
    falcorPath: args,
    paths: args,
  };
}

export function retrieveValue(path) {
  return {
    _id: uuid(),
    type: RETRIEVE_VALUE,
    falcorPath: path,
    path,
  };
}

export function setPath(path, value) {
  return {
    _id: uuid(),
    type: SET_PATH,
    falcorPath: pathValue(path, value),
    path,
    value,
  };
}

export function setPaths() {
  const args = Array.prototype.slice.call(arguments);

  return {
    _id: uuid(),
    type: SET_PATHS,
    falcorPath: args,
    paths: args,
  };
}

export function callPath(path, args, refPaths, thisPaths) {
  return {
    _id: uuid(),
    type: CALL_PATH,
    falcorPath: path,
    path,
    args,
    refPaths,
    thisPaths,
  };
}

export function clear() {
  return { type: CLEAR };
}
