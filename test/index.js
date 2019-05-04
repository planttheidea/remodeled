// test
import test from 'ava';
import React from 'react';

// src
import * as index from 'src/index';

test('if model will return a decorator the wraps the component correctly', (t) => {
  const options = {
    isPureComponent: true,
  };

  const getModeledComponent = index.default(options);

  const Component = function Div(props) {
    return <div {...props} />;
  };

  const Result = getModeledComponent(Component);

  t.is(typeof Result, 'function');
  t.is(Result.displayName, `Modeled(${Component.name})`);

  const props = {
    'data-foo': 'bar',
  };

  const result = Result(props);

  t.is(typeof result.type, 'function');
  t.is(result.type.name, 'Modeled');
  t.deepEqual(result.props, {
    __component: Component,
    __options: {
      ...options,
      childContextTypes: undefined,
      contextTypes: undefined,
    },
    'data-foo': 'bar',
  });
});

test('if model will return a decorator the wraps the component correctly when no options are passed', (t) => {
  const options = undefined;

  const getModeledComponent = index.default(options);

  const Component = function Div() {
    return <div />;
  };

  const Result = getModeledComponent(Component);

  t.is(typeof Result, 'function');
  t.is(Result.displayName, `Modeled(${Component.name})`);
});

test('if model will return a decorator the wraps the component correctly with the displayName passed', (t) => {
  const options = {
    isPureComponent: true,
  };

  const getModeledComponent = index.default(options);

  const Component = function Div() {
    return <div />;
  };

  Component.displayName = 'Foo';

  const Result = getModeledComponent(Component);

  t.is(typeof Result, 'function');
  t.is(Result.displayName, `Modeled(${Component.displayName})`);
});

test('if model will return a decorator the wraps the component correctly with the fallback name passed', (t) => {
  const options = {
    isPureComponent: true,
  };

  const getModeledComponent = index.default(options);

  const Component = () => <div />;

  const Result = getModeledComponent(Component);

  t.is(typeof Result, 'function');
  t.is(Result.displayName, 'Modeled(Component)');
});
