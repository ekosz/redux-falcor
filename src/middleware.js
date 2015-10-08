import {
  RETRIEVE_PATH,
  RETRIEVE_VALUE,
  SET_PATH,
  RETRIEVE_PATHS,
} from './actions';

function UnreconizedActionTypeException(message) {
  this.message = message;
  this.name = 'UnreconizedActionTypeException';
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
      default:
        throw new UnreconizedActionTypeException('Do not know the action, ' + type);
      }

      return promise
        .then(res => {
          next({ ...rest, res, type: SUCCESS });
          return true;
        })
        .catch(error => {
          next({ ...rest, error, type: FAILURE });
          return false;
        });
    };
  };
}
