import React, { Component } from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import Main from './integration/main';
import { cache, falcor } from './src/model';

describe('integration', function() {
  let wrapper;
  
  before(function() {
    wrapper = mount(Main);
  });
  
  describe('mount', function() {
    it('runs without exceptions', function(){
      assert.ok(wrapper);
    });
    
    it('renders cache', function(done) {
      falcor._root.onChange();
      setTimeout(() => {
        const elements = wrapper.find('span');
        assert.equal(elements.length, 2);
        assert.equal(elements.at(0).text(), cache.people[0].movie);
        assert.equal(elements.at(1).text(), cache.people[0].name);
        done();
      }, 60);
    });
  });
});
