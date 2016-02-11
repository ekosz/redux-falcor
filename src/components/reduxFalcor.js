import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import hoistStatics from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function reduxFalcor() {

  return function wrapWithFalcor (WrappedComponent) {
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

      render() {
        return (
          <WrappedComponent {...this.props} falcor={this.falcor}/>
        );
      }
    }

    ReduxFalcor.displayName = `ReduxFalcor(${getDisplayName(WrappedComponent)})`;
    ReduxFalcor.WrappedComponent = WrappedComponent;

    ReduxFalcor.propTypes = {
      falcorStore: PropTypes.object,
      falcor: PropTypes.object
    };

    ReduxFalcor.contextTypes = {
      falcorStore: PropTypes.object.isRequired,
      falcor: PropTypes.object.isRequired
    };

    return hoistStatics(ReduxFalcor, WrappedComponent);
  }
}
