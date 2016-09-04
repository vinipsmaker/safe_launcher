import React, { Component, PropTypes } from 'react';
import NetworkStatusContainer from './network_status_container';
import Toaster from './toaster_container';

export default class App extends Component {
  render() {
    return (
      <div className="root">
        <NetworkStatusContainer />
        {this.props.children}
        <Toaster />
      </div>
    );
  }
}