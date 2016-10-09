import React, { Component } from 'react';
import assert from 'assert';
import { Model } from 'falcor';
import { shallow, mount } from 'enzyme';
import { mock, spy, stub } from 'sinon';
import { FalcorProvider } from '../src/index';
import App from './src/app';
import { cache } from './src/model';

function noop() {}

describe('FalcorProvider', function() {
  describe('initialization', function() {
    it('requires falcor prop', function() {
      assert.throws(() => shallow(<FalcorProvider />));
    });
    
    it('requires redux store', function() {
      assert.throws(() => shallow(<FalcorProvider falcor={falcor}><App /></FalcorProvider>));
    });
  });

  describe('changing a model', function() {
    let store;
    let component;
    let wrapper;
    let falcor;
    
    before(function() {
      store = { dispatch: noop };
      falcor = new Model({ cache });
      component = <FalcorProvider falcor={falcor} store={store}><App /></FalcorProvider>;
      wrapper = shallow(component);
    });
    
    it('renders child', function() {
      assert.ok(wrapper.some('App'));
    });
    
    it('gets the falcor model', function(done) {
      const falcorMock = mock(falcor);
      falcorMock.expects('getCache').once();
      falcor._root.onChange();
      setTimeout(() => {
        falcorMock.verify();
        falcorMock.restore();
        done();
      }, 60);
    });
    
    it('dispatches to the store', function(done) {
      const storeMock = mock(store);
      storeMock.expects('dispatch').once();
      falcor._root.onChange();
      setTimeout(() => {
        storeMock.verify();
        storeMock.restore();
        done();
      }, 60);
    });
  });

  describe('mount', function() {
    it('sets the context', function() {
      const store = { dispatch: noop };
      const falcor = new Model({ cache });
      const component = <FalcorProvider falcor={falcor} store={store}><App /></FalcorProvider>;
      const providerMock = mock(FalcorProvider.prototype);
      providerMock.expects('getChildContext').once();
      const wrapper = mount(component);
      providerMock.verify();
      providerMock.restore();
    });
  });
});
