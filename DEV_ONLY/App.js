import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {hot} from 'react-hot-loader';

import {model} from '../src';

const options = {
  // context
  getChildContext(model) {
    console.log('child context', model);

    return {
      special: 'thing'
    };
  },

  // lifecycle methods
  componentDidMount(model) {
    console.log('mounted', model);
  },
  componentDidUpdate(model) {
    console.log('updated', model);

    const {props: {count}, setState, state: {foo}} = model;

    if (count > 2 && foo !== 'baz') {
      setState(() => ({
        foo: 'baz'
      }));
    }
  },
  componentWillReceiveProps(model) {
    console.log('receiving props', model);

    console.log(model.getDOMNode());
  },

  // state
  initialState: {
    counter: 0,
    foo: 'bar'
  },

  // instance methods
  onAnotherThing(model) {
    console.log('definitely should not fire');
  },
  onClickButton(model) {
    console.log('button clicked', model);

    console.count('clicked');

    const [event] = model.args;

    console.log('node', model.getDOMNode());
    console.log('target', event.currentTarget);

    model.setState(({counter}) => ({
      counter: counter + 1
    }));
  },
  onSomethingElse(model) {
    console.log('should not fire');
  },

  // other options
  isPure: true
};

function Span({context}) {
  return <span>Context value: {JSON.stringify(context)}</span>;
}

Span.contextTypes = {
  special: PropTypes.string
};

const ModeledSpan = model()(Span);

function Div({props, methods, state}) {
  console.count('rendered');

  return (
    <div>
      passed children: {props.children}
      <br />
      foo in state: {state.foo}
      <br />
      counter in state: {state.counter}
      <br />
      <br />
      <button onClick={methods.onClickButton}>Click me to increment the local counter!</button>
      <br />
      <ModeledSpan />
    </div>
  );
}

Div.childContextTypes = {
  special: PropTypes.string
};

const ModeledDiv = model(options)(Div);

class App extends PureComponent {
  state = {
    counter: 0
  };

  onClickIncrementCounter = () => {
    this.setState(({counter}) => ({
      counter: counter + 1
    }));
  };

  render() {
    return (
      <div>
        <h1>App</h1>

        <button onClick={this.onClickIncrementCounter}>Click to increment parent counter</button>

        <br />
        <br />

        <ModeledDiv count={this.state.counter}>Basic div with count set to {this.state.counter}</ModeledDiv>

        <br />
        <br />

        <ModeledDiv>Another basic div with no count</ModeledDiv>
      </div>
    );
  }
}

export default hot(module)(App);
