import './helpers';
import { Model } from 'falcor';
import Router from 'falcor-router';
import expect from 'expect';
import {
  retrievePath,
  retrieveValue,
  setPath,
  setPaths,
  retrievePaths,
  callPath,
  RETRIEVE_VALUE,
  RETRIEVE_PATH,
  RETRIEVE_PATHS,
  SET_PATH,
  SET_PATHS,
  CALL_PATH,
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

    describe('UnrecognizedActionTypeException', () => {
      it('should throw when there is a falcorPath and an unknown action', () => {
        const dispatchError = () => dispatch({falcorPath: 'path', type: 'FAKE_ACTION'});

        expect(dispatchError).toThrow(/FAKE_ACTION/);
      });
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

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: RETRIEVE_PATH + '_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: RETRIEVE_PATH,
          path: 'my["email"]',
          cache: {
            my: {
              email: {
                $modelCreated: true,
                $size: 61,
                $type: 'atom',
                value: 'foo@bar.com',
              },
            },
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

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: RETRIEVE_PATH + '_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: RETRIEVE_PATH,
          path: 'my["email"]',
          cache: {
            my: {
              $size: 52,
              $type: 'ref',
              value: [ 'usersById', 35 ],
            },
            usersById: {
              35: {
                email: {
                  $modelCreated: true,
                  $size: 61,
                  $type: 'atom',
                  value: 'foo@bar.com',
                },
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

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: RETRIEVE_VALUE + '_REQUEST',
          path: 'my["email"]',
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: RETRIEVE_VALUE,
          path: 'my["email"]',
          cache: {
            my: {
              email: {
                $modelCreated: true,
                $size: 61,
                $type: 'atom',
                value: 'foo@bar.com',
              },
            },
          },
        });
      });

      it('returns the value in a promise', (done) => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
        };

        dispatch(retrieveValue('my["email"]')).then((email) => {
          expect(email).toEqual('foo@bar.com');
        }).then(done, done);
      });
    });

    describe('setPath', () => {
      it('updates falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
          },
        };

        await dispatch(setPaths(
          { path: 'my["email"]', value: 'baz@bar.com' },
          { path: 'my["name"]', value: 'Smith' },
        ));

        const paths = [
          { path: ['my', 'email'], value: 'baz@bar.com' },
          { path: ['my', 'name'], value: 'Smith' },
        ];

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: SET_PATHS + '_REQUEST',
          paths,
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: SET_PATHS,
          paths,
          cache: {
            my: {
              email: {
                $modelCreated: true,
                $size: 61,
                $type: 'atom',
                value: 'baz@bar.com',
              },
              name: {
                $modelCreated: true,
                $size: 55,
                $type: 'atom',
                value: 'Smith',
              },
            },
          },
        });
      });
    });

    describe('setPath', () => {
      it('updates falcor', async () => {
        cache = {
          my: {
            email: 'foo@bar.com',
            name: 'John',
          },
        };

        await dispatch(setPath('my["email"]', 'baz@bar.com'));

        expect(baseDispatch.calls.length).toEqual(2);

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: SET_PATH + '_REQUEST',
          path: 'my["email"]',
          value: 'baz@bar.com',
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: SET_PATH,
          path: 'my["email"]',
          value: 'baz@bar.com',
          cache: {
            my: {
              email: {
                $modelCreated: true,
                $size: 61,
                $type: 'atom',
                value: 'baz@bar.com',
              },
              name: {
                $modelCreated: true,
                $size: 54,
                $type: 'atom',
                value: 'John',
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

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: RETRIEVE_PATHS + '_REQUEST',
          paths: ['my["email"]', 'users["length"]'],
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: RETRIEVE_PATHS,
          paths: ['my["email"]', 'users["length"]'],
          cache: {
            my: {
              email: {
                $modelCreated: true,
                $size: 61,
                $type: 'atom',
                value: 'foo@bar.com',
              },
            },
            users: {
              length: {
                $modelCreated: true,
                $size: 51,
                $type: 'atom',
                value: 1,
              },
            },
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

        expect(baseDispatch.calls[0].arguments[0]).toMatchObject({
          type: CALL_PATH + '_REQUEST',
          path: 'users.add',
          args: { email: 'foo@bar.com', name: 'Baz' },
          refPaths: [[ 'name' ]],
          thisPaths: undefined,
        });

        expect(baseDispatch.calls[1].arguments[0]).toMatchObject({
          type: CALL_PATH,
          path: 'users.add',
          args: { email: 'foo@bar.com', name: 'Baz' },
          refPaths: [[ 'name' ]],
          thisPaths: undefined,
          cache: {
            users: {
              1: {
                $size: 52,
                $type: 'ref',
                value: ['usersById', 99],
              },
            },
            usersById: {
              99: {
                name: {
                  $modelCreated: true,
                  $size: 53,
                  $type: 'atom',
                  value: 'Baz',
                },
              },
            },
          },
        });
      });
    });
  });
});
