import expect from 'expect';
import falcorReducer from '../src/reducer';
import {
  RETRIEVE_VALUE,
  RETRIEVE_PATH,
  SET_PATH,
  RETRIEVE_PATHS,
  CALL_PATH,
} from '../src/actions';

describe('falcorReducer', () => {
  [
    RETRIEVE_VALUE + '_REQUEST',
    RETRIEVE_PATH + '_REQUEST',
    RETRIEVE_PATHS + '_REQUEST',
    SET_PATH + '_REQUEST',
    CALL_PATH + '_REQUEST',
  ].forEach((type) => {
    describe(type, () => {
      it('marks the state as loading', () => {
        const newState = falcorReducer(undefined, { type });

        expect(newState.loading).toBe(true);
      });
    });
  });

  describe(RETRIEVE_VALUE, () => {
    it('sets the loading attribute to false', () => {
      const newState = falcorReducer({loading: true}, { type: RETRIEVE_VALUE });

      expect(newState.loading).toBe(false);
    });
  });

  describe(RETRIEVE_PATH, () => {
    it('merges the result properly into an inital state', () => {
      const action = {
        type: RETRIEVE_PATH,
        res: {
          json: {
            foo: 'bar',
          },
        },
      };

      const newState = falcorReducer(undefined, action);
      expect(newState).toEqual({foo: 'bar', loading: false});
    });

    it('merges the result properly into an existing state', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATH,
        res: {
          json: {
            foo: 'baz',
          },
        },
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'baz', a: 'b', loading: false});
    });

    it('ignores missing results', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATH,
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'bar', a: 'b', loading: false});
    });
  });

  describe(SET_PATH, () => {
    it('merges the result properly into an inital state', () => {
      const action = {
        type: SET_PATH,
        res: {
          json: {
            foo: 'bar',
          },
        },
      };

      const newState = falcorReducer(undefined, action);
      expect(newState).toEqual({foo: 'bar', loading: false});
    });

    it('merges the result properly into an existing state', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: SET_PATH,
        res: {
          json: {
            foo: 'baz',
          },
        },
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'baz', a: 'b', loading: false});
    });

    it('ignores missing results', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATH,
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'bar', a: 'b', loading: false});
    });
  });

  describe(RETRIEVE_PATHS, () => {
    it('merges the result properly into an inital state', () => {
      const action = {
        type: RETRIEVE_PATHS,
        res: {
          json: {
            foo: 'bar',
          },
        },
      };

      const newState = falcorReducer(undefined, action);
      expect(newState).toEqual({foo: 'bar', loading: false});
    });

    it('merges the result properly into an existing state', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATHS,
        res: {
          json: {
            foo: 'baz',
          },
        },
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'baz', a: 'b', loading: false});
    });

    it('ignores missing results', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATH,
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'bar', a: 'b', loading: false});
    });
  });

  describe(CALL_PATH, () => {
    it('merges the result properly into an inital state', () => {
      const action = {
        type: CALL_PATH,
        res: {
          json: {
            foo: 'bar',
          },
        },
      };

      const newState = falcorReducer(undefined, action);
      expect(newState).toEqual({foo: 'bar', loading: false});
    });

    it('merges the result properly into an existing state', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: CALL_PATH,
        res: {
          json: {
            foo: 'baz',
          },
        },
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'baz', a: 'b', loading: false});
    });

    it('ignores missing results', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: RETRIEVE_PATH,
      };

      const newState = falcorReducer(state, action);
      expect(newState).toEqual({foo: 'bar', a: 'b', loading: false});
    });
  });

  [
    RETRIEVE_VALUE + '_FAILURE',
    RETRIEVE_PATH + '_FAILURE',
    RETRIEVE_PATHS + '_FAILURE',
    SET_PATH + '_FAILURE',
    CALL_PATH + '_FAILURE',
  ].forEach((type) => {
    describe(type, () => {
      it('marks the state as not loading', () => {
        const newState = falcorReducer({loading: true}, { type });

        expect(newState.loading).toBe(false);
      });
    });
  });
});
