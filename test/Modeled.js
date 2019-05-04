/* eslint-disable react/prop-types */

// test
import test from 'ava';
import React from 'react';
import ReactDOM from 'react-dom';
import sinon from 'sinon';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

// src
import * as component from 'src/Modeled';
import * as utils from 'src/utils';

test('if getInitialState will return the initialState passed', (t) => {
  const instance = {
    props: {
      __options: {
        initialState: 'initialState',
      },
    },
  };

  const result = component.getInitialState(instance);

  t.is(result, instance.props.__options.initialState);
});

test('if getInitialState will return an empty object when no initialState passed', (t) => {
  const instance = {
    props: {
      __options: {},
    },
  };

  const result = component.getInitialState(instance);

  t.deepEqual(result, {});
});

test('if createGetDOMNode will call findDOMNode on the instance', (t) => {
  const instance = {};

  const getDOMNode = component.createGetDOMNode(instance);

  const stub = sinon.stub(ReactDOM, 'findDOMNode').returnsArg(0);

  const result = getDOMNode();

  t.true(stub.calledOnce);
  t.true(stub.calledWith(instance));

  stub.restore();

  t.is(result, instance);
});

test('if createGetModel creates a method that gets the model passed to all functions', (t) => {
  const instance = {
    context: {
      deep: 'context',
    },
    getDOMNode() {},
    methods: {
      deep: 'methods',
    },
    setState() {},
    state: {
      deep: 'state',
    },
  };

  const getModel = component.createGetModel(instance);

  const stub = sinon.stub(utils, 'getPassedProps').returnsArg(0);

  const props = {
    deep: 'props',
  };

  const result = getModel(props);

  t.true(stub.calledOnce);
  t.true(stub.calledWith(props));

  stub.restore();

  t.deepEqual(result, {
    context: instance.context,
    getDOMNode: instance.getDOMNode,
    methods: instance.methods,
    props,
    setState: instance.setState,
    state: instance.state,
  });
});

test('if Modeled will render correctly', (t) => {
  const options = {};
  const Modeled = component.getModeled(options);

  const props = {
    __component({children, ...props}) {
      return <div {...props}>{children}</div>;
    },
    __options: options,
    children: 'child',
    'data-foo': 'bar',
  };

  const wrapper = shallow(<Modeled {...props} />);

  t.snapshot(toJson(wrapper));
});

test('if Modeled will render correctly when pure', (t) => {
  const options = {
    isPureComponent: true,
  };
  const Modeled = component.getModeled(options);

  const props = {
    __component({children, ...props}) {
      return <div {...props}>{children}</div>;
    },
    __options: options,
    children: 'child',
    'data-foo': 'bar',
  };

  const wrapper = shallow(<Modeled {...props} />);

  t.snapshot(toJson(wrapper));
});

/* eslint-enable */
