# Redux-Falcor

redux-falcor helps connect your Redux applications to your Falcor API.

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
import { reduxFalcor, updateFalcorCache } from 'redux-falcor';
import App from './App';

class AppContainer extends Component {

  handleClick(event) {
    event.preventDefault();
    this.props.getData().catch(() => {
      console.error('Some path failed')
    });
  }

  render() {
    const { falcor } = this.props;
    console.log(falcor.getCache());
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
function mapDispatchToProps(dispatch, props) {
  return {
    getData(){
      const { falcor } = props;
      return falcor.call(['some', 'path']).then(() => {
        return dispatch(updateFalcorCache(falcor.getCache()));
      });
    }
  };
}

export default reduxFalcor()(connect(mapStateToProps)(AppContainer));

/**
 * Example with decorators
 */
@reduxFalcor()
@connect((state) => ({
  currentUser: state.falcor.currentUser || {}
}), (dispatch, props) => ({
  getData(){
    const { falcor } = props
    return falcor.call(['some', 'path']).then(() => {
      return dispatch(updateFalcorCache(falcor.getCache()));
    });
  }  
})
export default class AppContainer extends Component {

  handleClick(event) {
    event.preventDefault();
    this.props.getData().catch(() => {
      console.error('Some path failed')
    });
  }

  render() {
    const { falcor } = this.props;
    console.log(falcor.getCache());
    return (
      <App
        handleClick={this.handleClick.bind(this)}
        currentUser={this.props.currentUser}
      />
    );
  }
}
```

You can see `reduxFalcor` has provided our falcor model to the component via the `falcor` prop.
This is useful for calling our `falcor-router` which provides the data to dispatch `updateFalcorCache` actions.
Its values can then directly accessed from the falcor cache which keeps them in sync with the store.

**Warning**

Because falcor is intrinsically asynchronous your code can not rely on any one
piece of state being present when rendering. In the example above we give
a default for `currentUser` when we haven't fetched that piece of data yet.
To solve this issue its best to load the data before and pass them as props.
For example checkout [redial](https://github.com/markdalgleish/redial).

### Thanks

This library was *heavy* influenced by @gaearon and his work on
`react-redux`(https://github.com/rackt/react-redux). I would also like to thank
@trxcllnt for helping solve some of the problems with earlier versions of
`redux-falcor`. This library would not be as usefull as it is now without his
input.

### Licence

MIT
