import { Component, PropTypes, Children } from 'react';
import expandCache from 'falcor-expand-cache';

import createStore from './createStore';

function debounce(func, wait) {
  let timeout;
  return function doDebounce() {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function attachOnChange(falcor, store) {
  // TODO: Throttle requests here
  const handler = debounce(() => {
    store.trigger(expandCache(falcor.getCache()));
  }, 50);

  const root = falcor._root;
  if (!root.onChange) {
    root.onChange = handler;
    return;
  }

  const oldOnChange = root.onChange;
  root.onChange = () => {
    oldOnChange();
    handler();
  };
}

export default class FalcorProvider extends Component {
  static propTypes = {
    falcor: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = {
    falcor: PropTypes.object.isRequired,
    falcorStore: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.falcor = props.falcor;
    this.falcorStore = createStore(props.store);
    attachOnChange(props.falcor, this.falcorStore);
  }

  getChildContext() {
    return {
      falcor: this.falcor,
      falcorStore: this.falcorStore,
    };
  }

  render() {
    let {children} = this.props
    children = children()
    return children
  }
}
