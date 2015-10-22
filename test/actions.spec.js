import expect from 'expect';

import { setPath, SET_PATH } from '../src/actions';

describe('redux-falcor actions', () => {
  describe('setPath', () => {
    describe('when the first argument is a JSONEnvelope', () => {
      it('passes the JSONEnvelope along', () => {
        const envelope = {
          json: {
            todos: {
              0: { done: true },
            },
          },
        };

        expect(setPath(envelope)).toEqual({
          type: SET_PATH,
          falcorPath: envelope,
          path: envelope,
          value: undefined,
        });
      });
    });

    describe('when the first argument is a path', () => {
      it('wraps the path value pair in a pathValue', () => {
        const path = ['todos', 0, 'done'];
        const value = true;

        expect(setPath(path, value)).toEqual({
          type: SET_PATH,
          falcorPath: { path: [ 'todos', 0, 'done' ], value: true },
          path,
          value,
        });
      });
    });
  });
});
