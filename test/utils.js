// test
import test from 'ava';
import sinon from 'sinon';

// src
import * as utils from 'src/utils';
import {IGNORED_PROPS, LIFECYCLE_METHODS} from 'src/constants';

test('if getPassedProps will return the props with the ignored props removed', (t) => {
  const props = {
    foo: 'bar',
    [IGNORED_PROPS[0]]: 'baz'
  };

  const result = utils.getPassedProps(props);

  t.deepEqual(result, {foo: 'bar'});
});

test('if identity will return the first argument passed', (t) => {
  const args = ['foo', 'bar', 'baz'];

  const result = utils.identity(...args);

  t.is(result, args[0]);
});

test('if createInstanceMethod will create an instance method that will call with the model plus the args', (t) => {
  const response = {
    method: 'result'
  };

  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      foo: 'bar'
    }
  };
  const method = sinon.stub().returns(response);

  const instanceMethod = utils.createInstanceMethod(instance, method);

  const args = ['foo', 'bar', 'baz'];

  const result = instanceMethod(...args);

  t.true(instance.getModel.calledOnce);
  t.true(instance.getModel.calledWith(instance.props));

  t.true(method.calledOnce);
  t.true(
    method.calledWith({
      ...instance.props,
      args
    })
  );

  t.is(result, response);
});

test('if getInstanceMethods will return the methods for the instance', (t) => {
  const instance = {};
  const options = {
    componentDidMount() {},
    foo: 'bar',
    onClick() {}
  };

  const result = utils.getInstanceMethods(instance, options);

  t.deepEqual(Object.keys(result), ['onClick']);
  t.is(typeof result.onClick, 'function');
});

test('if getPassedModel will return the model based on props when no extraProperties are passed', (t) => {
  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      foo: 'bar'
    }
  };
  const extraProperties = [];
  const args = [];

  const result = utils.getPassedModel(instance, extraProperties, args);

  t.deepEqual(result, instance.props);
});

test('if getPassedModel will return the model based on props when extraProperties are passed', (t) => {
  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      foo: 'bar'
    }
  };
  const extraProperties = ['foo'];
  const args = [{bar: 'baz'}];

  const result = utils.getPassedModel(instance, extraProperties, args);

  t.deepEqual(result, {
    ...instance.props,
    foo: args[0]
  });
});

test('if addLifecycleMethod will add the lifecycle method to the instance', (t) => {
  const method = 'foo';
  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      __options: {
        [method]: sinon.stub().returnsArg(0)
      }
    }
  };
  const extraProperties = [];

  utils.addLifecycleMethod(instance, method, extraProperties);

  t.is(typeof instance[method], 'function');

  const args = ['foo'];

  const result = instance[method](...args);

  t.true(instance.props.__options[method].calledOnce);
  t.true(instance.props.__options[method].calledWith(utils.getPassedModel(instance, extraProperties, args)));

  t.is(result, instance.props);
});

test('if addLifecycleMethod will add the lifecycle method to the instance when extraProperties is not provided', (t) => {
  const method = 'foo';
  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      __options: {
        [method]: sinon.stub().returnsArg(0)
      }
    }
  };
  const extraProperties = undefined;

  utils.addLifecycleMethod(instance, method, extraProperties);

  t.is(typeof instance[method], 'function');

  const args = ['foo'];

  const result = instance[method](...args);

  t.true(instance.props.__options[method].calledOnce);
  t.true(instance.props.__options[method].calledWith(utils.getPassedModel(instance, [], args)));

  t.is(result, instance.props);
});

test('if addLifecycleMethod will not add the lifecycle method when it is not a function', (t) => {
  const method = 'foo';
  const instance = {
    getModel: sinon.stub().returnsArg(0),
    props: {
      __options: {
        [method]: 'not a function'
      }
    }
  };
  const extraProperties = undefined;

  utils.addLifecycleMethod(instance, method, extraProperties);

  t.is(typeof instance[method], 'undefined');
});
