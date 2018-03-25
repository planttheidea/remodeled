// external dependencies
import React from 'react';

// constants
import {IGNORED_PROPS, LIFECYCLE_METHODS} from './constants';

/**
 * @function getPassedProps
 *
 * @description
 * get the props to pass to the model
 *
 * @param {Object} props the internal component props
 * @returns {Object} the props to pass to the model
 */
export const getPassedProps = (props) =>
  Object.keys(props).reduce((passedProps, key) => {
    if (!~IGNORED_PROPS.indexOf(key)) {
      passedProps[key] = props[key];
    }

    return passedProps;
  }, {});

/**
 * @function identity
 *
 * @description
 * return the first argument passed
 *
 * @param {any} value the value to return
 * @returns {any} the returned value
 */
export const identity = (value) => value;

/**
 * @constant {Array<function>} extraPropertiesGetters the getters for the values of the extra properties
 */
export const EXTRA_PROPERTIES_GETTERS = [getPassedProps, identity];

/**
 * @function createInstanceMethod
 *
 * @description
 * create a wrapper for the instance method
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} method the instance method
 * @returns {function(...Array<any>): any} the wrapped instance method
 */
export const createInstanceMethod = (instance, method) => (...args) =>
  method({
    ...instance.getModel(instance.props),
    args
  });

/**
 * @function getInstanceMethods
 *
 * @description
 * get the instance methods for the component
 *
 * @param {ReactComponent} instance the component instance
 * @param {Object} options the options passed to the decorator
 * @returns {Object} the instance methods
 */
export const getInstanceMethods = (instance, options) =>
  Object.keys(options).reduce((instanceMethods, key) => {
    if (typeof options[key] === 'function' && !~LIFECYCLE_METHODS.indexOf(key)) {
      instanceMethods[key] = createInstanceMethod(instance, options[key]);
    }

    return instanceMethods;
  }, {});

/**
 * @function getPassedModel
 *
 * @description
 * get the model to pass to the method
 *
 * @param {ReactComponent} instance the component instance
 * @param {Array<string>} extraProperties the extra properties to add to the model
 * @param {Arguments} args the arguments to the function
 * @returns {Object} the model to pass
 */
export const getPassedModel = (instance, extraProperties, args) =>
  extraProperties.length
    ? extraProperties.reduce((model, prop, index) => {
      model[prop] = EXTRA_PROPERTIES_GETTERS[index](args[index]);

      return model;
    }, instance.getModel(instance.props))
    : instance.getModel(instance.props);

/**
 * @function createLifecycleMethodWrapper
 *
 * @description
 * wrap the lifecycle method to allow injection of the model
 *
 * @param {ReactComponent} instance the component instance
 * @param {function} method the lifecycle method
 * @param {Array<string>} extraProperties the extra properties to add to the model
 */
export const addLifecycleMethod = (instance, method, extraProperties = []) => {
  const lifecycleMethod = instance.props.__options[method];

  if (typeof lifecycleMethod === 'function') {
    instance[method] = function() {
      return lifecycleMethod(getPassedModel(instance, extraProperties, arguments));
    };
  }
};
