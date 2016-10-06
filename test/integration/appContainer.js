import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from '../../src/index.js';
import App from '../src/app.js';

class AppContainer extends Component {
  // fetchFalcorDeps() {
  //   return Promise.resolve();
  // }

  render() {
    return (
      <App
        name={this.props.people && this.props.people[0].name}
        movie={this.props.people && this.props.people[0].movie}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    people: state.falcor.people
  };
}

export default connect(
  mapStateToProps,
)(reduxFalcor(AppContainer));
