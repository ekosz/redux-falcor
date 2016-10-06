import React from 'react';
import { Provider } from 'react-redux';
import { FalcorProvider } from '../../src/index';
import { falcor } from '../src/model';
import {store} from './store';
import AppContainer from './appContainer';


const main = (
  <Provider store={store}>
    <FalcorProvider store={store} falcor={falcor}>
      <AppContainer />
    </FalcorProvider>
  </Provider>
);

export default main;
