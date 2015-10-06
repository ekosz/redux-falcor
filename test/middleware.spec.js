import { Model } from 'falcor';
import expect from 'expect';
import { retrievePath, retrieveValue } from '../src/actions';
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
  });
});
