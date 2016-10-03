import assert from 'assert';
import reduxFalcorReducer, { update } from '../src/components/duck.js';

describe('duck', function() {
  describe('update', function() {
    it('has the right type', function() {
      const action = update();
      assert.equal('redux-falcor/UPDATE', action.type);
    });
  
    it('has the payload', function() {
      const cache = {
        name: 'Luke Skywalker',
        movie: 'Star Wars'
      };
      const action = update(cache);
      assert.equal(action.payload, cache);
    });    
  });
  
  describe('reduxFalcorReducer', function() {
    describe('default action', function() {
      it('should have type', function() {
        assert.throws(() => {
          reduxFalcorReducer();
        });
      });

      it('should initialize state', function() {
        const state = reduxFalcorReducer(undefined, { type: 'INIT' });
        assert.deepEqual(state, {});
      });
    });

    describe('update action', function() {
      it('returns payload', function() {
        const payload = {
          name: 'Luke Skywalker',
          movie: 'Star Wars'
        };
        const action = {
          type: 'redux-falcor/UPDATE',
          payload
        };
        const state = reduxFalcorReducer(undefined, action);
        assert.deepEqual(state, payload);
      });
    });
  });
});
