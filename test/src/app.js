import React from 'react';

export default class App extends React.Component {

  constructor() {
    super();
    this.fetchFalcorDeps = this.fetchFalcorDeps.bind(this);
  }

  fetchFalcorDeps() {
    return Promise.resolve();
  }

  render() {
    return (
      <div>My favorite movie is <span>{this.props.movie}</span>. - <span>{this.props.name}</span></div>
    );
  }
}
