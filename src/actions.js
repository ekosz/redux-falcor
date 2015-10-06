export const RETRIEVE_PATH = 'FALCOR_RETRIEVE_PATH';
export const RETRIEVE_VALUE = 'FALCOR_RETRIEVE_VALUE';

export function retrievePath(path) {
  return {
    type: RETRIEVE_PATH,
    falcorPath: path,
    path,
  };
}

export function retrieveValue(path) {
  return {
    type: RETRIEVE_VALUE,
    falcorPath: path,
    path,
  };
}
