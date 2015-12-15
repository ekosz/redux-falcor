import {
  RETRIEVE_PATH,
  RETRIEVE_VALUE,
  SET_PATH,
  SET_PATHS,
  RETRIEVE_PATHS,
  CALL_PATH,
} from './actions';

function UnrecognizedActionTypeException(message) {
  this.message = message;
  this.name = 'UnrecognizedActionTypeException';
}

export default function createFalcorMiddleware(falcor) {
  return function falcorMiddleware() {
    return next => action => {
      const { falcorPath, type, ...rest } = action;

      if (!falcorPath) {
        return next(action);
      }

      const SUCCESS = type;
      const REQUEST = type + '_REQUEST';
      const FAILURE = type + '_FAILURE';

      next({ ...rest, type: REQUEST });

      let promise;

      switch (type) {
      case RETRIEVE_PATH:
        promise = falcor.get(falcorPath);
        break;
      case RETRIEVE_PATHS:
        promise = falcor.get.apply(falcor, falcorPath);
        break;
      case RETRIEVE_VALUE:
        promise = falcor.getValue(falcorPath);
        break;
      case SET_PATH:
        promise = falcor.set(falcorPath);
        break;
      case SET_PATHS:
        promise = falcor.set.apply(falcor, falcorPath);
        break;
      case CALL_PATH:
        let { args } = rest;
        const { refPaths, thisPaths } = rest;

        if (!Array.isArray(args)) {
          args = [ args ];
        }

        if (thisPaths) {
          promise = falcor.call(falcorPath, args, refPaths, thisPaths);
        } else if (refPaths) {
          promise = falcor.call(falcorPath, args, refPaths);
        } else {
          promise = falcor.call(falcorPath, args);
        }

        break;
      default:
        throw new UnrecognizedActionTypeException('Do not know the action, ' + type);
      }

      return promise
        .then(res => {
          next({ ...rest, cache: falcor.getCache(), type: SUCCESS });
          return res;
        })
        .catch(error => {
          next({ ...rest, error, type: FAILURE });
          return error;
        });
    };
  };
}
