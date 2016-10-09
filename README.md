![Redux Falcor](static/logo.png "Redux Falcor")

Redux Falcor connects Redux applications to the Falcor API.

[![build status](https://img.shields.io/travis/ekosz/redux-falcor/master.svg?style=flat-square)](https://travis-ci.org/ekosz/redux-falcor)
[![npm version](https://img.shields.io/npm/v/redux-falcor.svg?style=flat-square)](https://www.npmjs.com/package/redux-falcor)

[Change Log](https://github.com/ekosz/redux-falcor/releases)

### Installation

To install:

```
npm install --save redux-falcor
```

### Usage

First include `redux-falcor` in the initial setup of your application.

```js
import { createStore, combineReducers } from 'redux';
import { reducer as falcorReducer } from 'redux-falcor';

const reducers = combineReducers({
  falcor: falcorReducer,
  // Other reducers here
});


const store = finalCreateStore(reducers);
```

Next  attach the `FalcorProvider` at the top level of your react application.

```js
import { Provider } from 'react-redux';
import { FalcorProvider } from 'redux-falcor';
import { Model } from 'falcor';
import store from './store'; // Your redux store

// The falcor model that redux-falcor will query
const falcor = new Model({
  cache: {
    // Optional data here
  }
});

const application = (
  <Provider store={store}>
    <FalcorProvider store={store} falcor={falcor}>
      {/* The rest here */}
    </FalcorProvider>
  </Provider>
);

React.render(application, document.getElementById('app'));
```

With that in place we can now connect our components to the falcor-store
provided by `redux-falcor`. This should feel familiar to `react-redux`.

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'redux-falcor';
import App from './App';

class AppContainer extends Component {
  fetchFalcorDeps() {
    return this.props.falcor.get(
      ['currentUser', App.queries.user()],
    );
  }

  handleClick(event) {
    event.preventDefault();

    this.props.falcor.call(['some', 'path']).then(() => {
      console.log('Some path called');
    }).catch(() => {
      console.error('Some path failed');
    });
  }

  render() {
    return (
      <App
        handleClick={this.handleClick.bind(this)}
        currentUser={this.props.currentUser}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.falcor.currentUser || {}
  };
}

export default connect(
  mapStateToProps,
)(reduxFalcor(AppContainer));
```

You can see `reduxFalcor` has done two things for us. First off, our Falcor
model has been provided to our Component via the `falcor` prop. This is useful
for creating event handlers that call out to our `falcor-router`.

Secondly, if we define the method `fetchFalcorDeps`, `redux-falcor` will
automatically call that function when the component is first mounted to the DOM
as well as whenever the Falcor cache has been invalidated. This method should
return a promise that fetches all of our Falcor dependencies for this
component.

**Warning**

Because Falcor is intrinsically asynchronous, your code can not rely on any one
piece of state being present when rendering. In the example above we give
a default for `currentUser` when we haven't fetched that piece of data yet.

### Thanks

This library was *heavy* influenced by @gaearon and his work on
`react-redux`(https://github.com/rackt/react-redux). I would also like to thank
@trxcllnt for helping solve some of the problems with earlier versions of
`redux-falcor`. This library would not be as useful as it is now without his
input.

### Licence

MIT
