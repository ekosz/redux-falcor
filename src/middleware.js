import { RETRIEVE_PATH, RETRIEVE_VALUE } from './actions';

export default function createFalcorMiddleware(falcor) {
  return function falcorMiddleware() {
    return next => action => {
      const { falcorPath, type, ...rest } = action;

      if (type !== RETRIEVE_PATH && type !== RETRIEVE_VALUE) {
        return next(action);
      }

      const SUCCESS = type;
      const REQUEST = type + '_REQUEST';
      const FAILURE = type + '_FAILURE';

      next({ ...rest, type: REQUEST });

      let promise;

      if (type === RETRIEVE_PATH) {
        promise = falcor.get(falcorPath);
      } else {
        promise = falcor.getValue(falcorPath);
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
