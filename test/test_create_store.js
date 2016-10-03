import assert from 'assert';
import { mock, spy } from 'sinon';
import createStore from '../src/components/createStore.js';

describe('createStore', function() {
  const reduxStore = {
    dispatch() {}
  };

  it('include subscribe and trigger', function() {
    const result = createStore();
    assert.ok(result);
    assert.ok(result.subscribe);
    assert.ok(result.trigger);
  });

  it('uses redux store for dispatch', function() {
    const reduxStoreMock = mock(reduxStore);
    reduxStoreMock.expects('dispatch').once();
    const result = createStore(reduxStore);
    result.trigger('cache');
    reduxStoreMock.verify();
  });
  
  it('returns cache', function() {
    const store = createStore(reduxStore);
    const cache = { message: 'Test' };
    const result = store.trigger(cache);
    assert.equal(result, cache);
  });

  it('returns an unsubscribe function', function() {
    const store = createStore();
    const fn = store.subscribe();
    assert.equal(typeof fn, 'function');
    assert.equal(fn.name, 'unsubscribe');
  });
  
  it('is called when trigger is invoked', function() {
    const store = createStore(reduxStore);
    const listener = spy();
    store.subscribe(listener);
    store.trigger('cache');
    assert(listener.calledOnce);
  });
  
  it('has a listener that unsubscribes', function() {
    const store = createStore(reduxStore);
    const listener = spy();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.trigger('cache');
    assert(!listener.called);
  });
});
