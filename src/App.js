import React, { Component } from 'react';
import Covid from './components/coronaReport/coronaReport'

export default class App extends Component {
  render() {
    return (
      <div className="page-wrapper">
        <Covid />
      </div>
    )
  }
} 