import React, { Component } from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import { mock, spy, stub } from 'sinon';
import { reduxFalcor } from '../src/index';
import App from './src/app';

function noop() {}

describe('reduxFalcor', function() {
  describe('initialization', function() {
    it('throws if no wrappable component', function() {
      assert.throws(() => reduxFalcor());
    });
    
    it('wraps component', function() {
      const wrapper = reduxFalcor(App);
      assert.ok(wrapper);
      assert.equal(wrapper.displayName, 'ReduxFalcor(App)');
      assert.equal(wrapper.WrappedComponent, App);
    });
  });

  describe('shallow render', function() {
    let wrapper;
    
    before(function() {
      wrapper = reduxFalcor(App);
    });
    
    it('reduxFalcor element is created', function() {
      const element = React.createElement(wrapper);
      assert.ok(element);
    });
    
    it('reduxFalcor element requires store', function() {
      const element = React.createElement(wrapper);
      assert.throws(() => shallow(element), /Invariant Violation:/);
    });
    
    it('reduxFalcor warns when no context', function() {
      console.error = spy();
      const element = React.createElement(wrapper, { falcorStore: {}, falcor: {} });
      const node = shallow(element);
      assert.ok(console.error.calledTwice);
      console.error = noop;
    });
    
    it('reduxFalcor element is rendered', function() {
      const element = React.createElement(wrapper, { falcorStore: {}, falcor: {} });
      const node = shallow(element);
      assert.ok(node.exists('App'));
    });
    
    it('reduxFalcor element has falcor prop', function() {
      const falcor = {};
      const element = React.createElement(wrapper, { falcorStore: {}, falcor });
      const node = shallow(element);
      const appNode = node.find('App').first();
      assert.equal(appNode.props().falcor, falcor);
    });
  });

  describe('mount', function() {
    let wrapper;
    let falcorStore;

    before(function() {
      wrapper = reduxFalcor(App);
      falcorStore = {
        subscribe() {}
      };
    });
    
    it('reduxFalcor is mounted', function() {
      const element = React.createElement(wrapper, { falcorStore, falcor: {} });
      const node = mount(element);
      assert.ok(node);
    });
    
    it('reduxFalcor subscribes to the store on mounting', function() {
      const falcorStoreMock = mock(falcorStore);
      falcorStoreMock.expects('subscribe').once();
      const element = React.createElement(wrapper, { falcorStore, falcor: {} });
      const node = mount(element);
      falcorStoreMock.verify();
      falcorStoreMock.restore();
    });
    
    it('reduxFalcor calls fetchFalcorDeps on mounting', function() {
      const appMock = mock(App.prototype);
      appMock.expects('fetchFalcorDeps').returns(Promise.resolve()).once();
      const falcorStoreStub = stub(falcorStore, 'subscribe').returns(noop);
      const element = React.createElement(wrapper, { falcorStore, falcor: {} });
      const node = mount(element);
      appMock.verify();
      appMock.restore();
      falcorStoreStub.restore();
    });
    
    it('reduxFalcor unsubscribes on unmounting', function() {
      const unsubscribe = spy();
      const falcorStoreStub = stub(falcorStore, 'subscribe').returns(unsubscribe);
      const element = React.createElement(wrapper, { falcorStore, falcor: {} });
      const node = mount(element);
      // unmount causes an exception, see Enzyme open issues.
      assert.throws(() => node.unmount());
      assert.ok(unsubscribe.calledOnce);
      falcorStoreStub.restore();
    });
  });
});
