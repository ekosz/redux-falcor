import jsdom from 'jsdom';

function noop() {}

before(function() {
  // disable react warnings!
  console.error = noop;
  // load jsdom
  const doc = jsdom.jsdom('');
  global.document = doc;
  global.window = doc.defaultView;
  global.navigator = window.navigator;
});
