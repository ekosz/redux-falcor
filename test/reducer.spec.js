import expect from 'expect';
import falcorReducer from '../src/reducer';
import { RETRIEVE_PATH } from '../src/actions';

describe('falcorReducer', () => {
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
      expect(newState).toEqual({foo: 'bar'});
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
      expect(newState).toEqual({foo: 'baz', a: 'b'});
    });
  });
});
