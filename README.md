# Redux-Falcor

redux-falcor helps connect your Redux applications to your Falcor API.

[![build status](https://img.shields.io/travis/ekosz/redux-falcor/master.svg?style=flat-square)](https://travis-ci.org/ekosz/redux-falcor)

### Installation

To install:

```
npm install --save redux-falcor
```

### Usage

First include redux-falcor in the initial setup of your application.

```js
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { createFalcorMiddleware, falcorReducer } from 'redux-falcor';
import { Model } from 'falcor';

const reducer = combineReducers({
  entities: falcorReducer
  // Other reducers here
});

// The falcor model that redux-falcor will query
const falcor = new Model({
  cache: {
    // Optional data here
  }
});

const finalCreateStore = compose(
  applyMiddleware(createFalcorMiddleware(falcor)),
  createStore
);

const store = finalCreateStore(reducer);
```

We can now access the data returned from Falcor through `state.entities.*`. To
query that data we just need to dispatch a special action.

```js
import { retrievePath } from 'redux-falcor';

store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch(retrievePath('usersById[35]["email"]');

// This will logged:
// {
//   entities: {
//     usersById: {
//       35: {
//         email: "foo@bar.com"
//       }
//     }
//   }
// }
```

While its not suggested, you can also hook into the Falcor promise directly if
you need to. For example:

```js
import { retrieveValue } from 'redux-falcor';

store.dispatch(retrieveValue('usersById[35]["email"]').then((email) => {
  console.log(email); // foo@bar.com
});
```

### Licence

MIT
