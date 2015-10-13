import { Model } from 'falcor';
import Router from 'falcor-router';
import expect from 'expect';
import {
  retrievePath,
  retrieveValue,
  setPath,
  retrievePaths,
  callPath,
} from '../src/actions';
import createFalcorMiddleware from '../src/middleware';

describe('createFalcorMiddleware', () => {
  let cache;
  let createFalcor;

  beforeEach(() => {
    createFalcor = () => new Model({cache});
  });

  it('returns a middleware function', () => {
    expect(createFalcorMiddleware(createFalcor())).toBeA('function');
  });

  describe('falcorMiddleware', () => {
    let baseDispatch;
    let dispatch;

    beforeEach(() => {
      baseDispatch = expect.createSpy();
      dispatch = function dis(action) {
        const methods = { dispatch: dis, getState: () => {} };
        return createFalcorMiddleware(createFalcor())(methods)(baseDispatch)(action);
      };
    });

    describe('retrievePath', () => {
      it('gets data from falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
        };

        await dispatch(retrievePath('my["email"]'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATH_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATH',
          path: 'my["email"]',
          res: {
            json: cache,
          },
        });
      });

      it('expands references', async () => {
        cache = {
          my: { $type: 'ref', value: ['usersById', 35] },
          usersById: {
            35: {
              email: 'foo@bar.com',
            },
          },
        };

        await dispatch(retrievePath('my["email"]'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATH_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATH',
          path: 'my["email"]',
          res: {
            json: {
              my: {
                email: 'foo@bar.com',
              },
            },
          },
        });
      });
    });

    describe('retrieveValue', () => {
      it('gets data from falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
        };

        await dispatch(retrieveValue('my["email"]'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_VALUE_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_VALUE',
          path: 'my["email"]',
          res: 'foo@bar.com',
        });
      });
    });

    describe('setPath', () => {
      it('updates falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
        };

        await dispatch(setPath('my["email"]', 'baz@bar.com'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_SET_PATH_REQUEST',
          path: 'my["email"]',
          value: 'baz@bar.com',
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_SET_PATH',
          path: 'my["email"]',
          value: 'baz@bar.com',
          res: {
            json: {
              my: {
                email: 'baz@bar.com',
              },
            },
          },
        });
      });
    });

    describe('retrievePaths', () => {
      it('gets data from falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
          users: {
            length: 1,
          },
        };

        await dispatch(retrievePaths('my["email"]', 'users["length"]'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATHS_REQUEST',
          paths: ['my["email"]', 'users["length"]'],
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_RETRIEVE_PATHS',
          paths: ['my["email"]', 'users["length"]'],
          res: {
            json: cache,
          },
        });
      });
    });

    describe('callPath', () => {
      it('passes its arguments to falcor properly', async () => {
        const router = new Router([{
          route: 'users.add',
          call: (path, args, refPaths, thisPaths) => {
            expect(path).toEqual(['users', 'add']);
            expect(args).toEqual([{email: 'foo@bar.com', name: 'Baz'}]);
            expect(refPaths).toEqual([['name']]);
            expect(thisPaths).toEqual([]);

            return [
              { path: ['users', 1], value: { $type: 'ref', value: ['usersById', 99] } },
            ];
          },
        }, {
          route: 'usersById[99].name',
          get: () => [{ path: ['usersById', 99, 'name'], value: 'Baz' }],
        }]);

        createFalcor = () => new Model({source: router});

        await dispatch(
          callPath('users.add', {email: 'foo@bar.com', name: 'Baz'}, [['name']])
        );

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toEqual({
          type: 'FALCOR_CALL_PATH_REQUEST',
          path: 'users.add',
          args: { email: 'foo@bar.com', name: 'Baz' },
          refPaths: [[ 'name' ]],
          thisPaths: undefined,
        });

        expect(baseDispatch.calls[1].arguments[0]).toEqual({
          type: 'FALCOR_CALL_PATH',
          path: 'users.add',
          args: { email: 'foo@bar.com', name: 'Baz' },
          refPaths: [[ 'name' ]],
          thisPaths: undefined,
          res: {
            json: {
              users: {
                1: {
                  name: 'Baz',
                },
              },
            },
          },
        });
      });
    });
  });
});
