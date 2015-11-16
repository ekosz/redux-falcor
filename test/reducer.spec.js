import './helpers';
import expect from 'expect';
import falcorReducer from '../src/reducer';
import {
  RETRIEVE_VALUE,
  RETRIEVE_PATH,
  SET_PATH,
  SET_PATHS,
  RETRIEVE_PATHS,
  CALL_PATH,
  CLEAR,
} from '../src/actions';

describe('falcorReducer', () => {
  [
    RETRIEVE_VALUE + '_REQUEST',
    RETRIEVE_PATH + '_REQUEST',
    RETRIEVE_PATHS + '_REQUEST',
    SET_PATH + '_REQUEST',
    SET_PATHS + '_REQUEST',
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
      expect(newState).toMatchObject({foo: 'bar'});
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
      expect(newState).toMatchObject({foo: 'baz', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar'});
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
      expect(newState).toMatchObject({foo: 'baz', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar', a: 'b'});
    });
  });

  describe(SET_PATHS, () => {
    it('merges the result properly into an inital state', () => {
      const action = {
        type: SET_PATHS,
        res: {
          json: {
            foo: 'bar',
          },
        },
      };

      const newState = falcorReducer(undefined, action);
      expect(newState).toMatchObject({foo: 'bar'});
    });

    it('merges the result properly into an existing state', () => {
      const state = {
        foo: 'bar',
        a: 'b',
      };

      const action = {
        type: SET_PATHS,
        res: {
          json: {
            foo: 'baz',
          },
        },
      };

      const newState = falcorReducer(state, action);
      expect(newState).toMatchObject({foo: 'baz', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar'});
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
      expect(newState).toMatchObject({foo: 'baz', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar'});
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
      expect(newState).toMatchObject({foo: 'baz', a: 'b'});
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
      expect(newState).toMatchObject({foo: 'bar', a: 'b'});
    });
  });

  describe(CLEAR, () => {
    it('clears all of the falcor state from the redux store', () => {
      const state = {
        foo: 'bar',
        a: 'b',
        loading: true,
        _requests: {abc: true},
      };

      const action = { type: CLEAR };
      const newState = falcorReducer(state, action);
      expect(newState).toEqual({loading: true, _requests: {abc: true}});
    });
  });

  [
    RETRIEVE_VALUE + '_FAILURE',
    RETRIEVE_PATH + '_FAILURE',
    RETRIEVE_PATHS + '_FAILURE',
    SET_PATH + '_FAILURE',
    SET_PATHS + '_FAILURE',
    CALL_PATH + '_FAILURE',
  ].forEach((type) => {
    describe(type, () => {
      it('marks the state as not loading', () => {
        const newState = falcorReducer({loading: true}, { type });

        expect(newState.loading).toBe(false);
      });
    });
  });

  describe('Multiple parallel loads', () => {
    it('stays loading even when one finishes before the other', () => {
      let state;
      // Start 2
      state = falcorReducer(undefined, { type: RETRIEVE_PATHS + '_REQUEST', _id: 'a' });
      state = falcorReducer(state, { type: CALL_PATH + '_REQUEST', _id: 'b' });

      // End 1
      state = falcorReducer(state, { type: RETRIEVE_PATHS, _id: 'a' });
      expect(state.loading).toBe(true);

      // End other
      state = falcorReducer(state, { type: CALL_PATH, _id: 'b' });
      expect(state.loading).toBe(false);
      expect(state._requests).toEqual({});
    });
  });
});
