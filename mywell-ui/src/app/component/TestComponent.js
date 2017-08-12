import React, { Component } from 'react'

class TestComponent extends Component {
  constructor() {
    super();
    console.log("constructing TestComponent");
  }

  render() {
    console.log("Rendering");
    return <div>
      <p>FooBar: {this.props.fooBar}</p>
      <p>Baz: {this.props.baz}</p>
      <div>HELLO THERE</div>
    </div>
  }
};

export default TestComponent;

// module.exports = angular
// .module('testComponent', [])
// .component('TestComp', {
//     bindings: {
//         comment: '<',
//     },
//     controller: function() {
//         ReactDOM.render(<TestComponent />, $element[0]);
//     }
// });
