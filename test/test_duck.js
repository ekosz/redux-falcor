import assert from 'assert';
import { update } from '../src/components/duck.js';

describe('duck', function() {
  it('update action has the right type', function() {
    const action = update();
    assert.equal('redux-falcor/UPDATE', action.type);
  });
  
  it('update action has the payload', function() {
    const cache = {
      name: 'Luke Skywalker',
      movie: 'Star Wars'
    };
    const action = update(cache);
    assert.equal(action.payload, cache);
  });
});
