import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function noop() {}

export default function reduxFalcor(WrappedComponent) {
  class ReduxFalcor extends Component {
    constructor(props, context) {
      super(props, context);

      this.falcor = props.falcor || context.falcor;
      this.falcorStore = props.falcorStore || context.falcorStore;

      invariant(this.falcorStore,
        `Could not find "falcorStore" in either the context or ` +
        `props of "${this.constructor.displayName}". ` +
        `Either wrap the root component in a <FalcorProvider>, ` +
        `or explicitly pass "falcorStore" as a prop to "${this.constructor.displayName}".`
      );
    }

    componentDidMount() {
      this.trySubscribe();
    }

    componentWillUnmount() {
      this.tryUnsubscribe();
    }

    trySubscribe() {
      if (!this.unsubscribe) {
        this.unsubscribe = this.falcorStore.subscribe(::this.handleChange);
        this.handleChange();
      }
    }

    handleChange() {
      const { wrappedInstance } = this.refs;

      if (!this.unsubscribe) return;
      if (!(typeof wrappedInstance.fetchFalcorDeps === 'function')) return;

      wrappedInstance.fetchFalcorDeps().then(noop);
    }

    tryUnsubscribe() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          falcor={this.falcor}
          ref="wrappedInstance"
        />
      );
    }
  }

  ReduxFalcor.displayName = `ReduxFalcor(${getDisplayName(WrappedComponent)})`;
  ReduxFalcor.WrappedComponent = WrappedComponent;

  ReduxFalcor.propTypes = {
    falcorStore: PropTypes.object,
    falcor: PropTypes.object,
  };

  ReduxFalcor.contextTypes = {
    falcorStore: PropTypes.object.isRequired,
    falcor: PropTypes.object.isRequired,
  };

  return hoistStatics(ReduxFalcor, WrappedComponent);
}
