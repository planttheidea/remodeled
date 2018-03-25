// external dependencies
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

// utils
import {addLifecycleMethod, getInstanceMethods, getPassedProps} from './utils';

/**
 * @function getInitialState
 *
 * @description
 * get the initial state of the component
 *
 * @param {ReactComponent} instance the component instance
 * @returns {Object} the initial state of the component
 */
export const getInitialState = (instance) => instance.props.__options.initialState || {};

/**
 * @function createGetDOMNode
 *
 * @description
 * create the method that retrieves the DOM node of the instance
 *
 * @param {ReactComponent} instance the component instance
 * @returns {function(): HTMLElement} the DOM node of the instance
 */
export const createGetDOMNode = (instance) => () => ReactDOM.findDOMNode(instance);

/**
 * @function createGetModel
 *
 * @description
 * create the method that retrieves the current model
 *
 * @param {ReactComponent} instance the component instance
 * @returns {function(Object): Object} the method to get the current model
 */
export const createGetModel = (instance) => (props) => ({
  context: instance.context,
  getDOMNode: instance.getDOMNode,
  methods: instance.methods,
  props: getPassedProps(props),
  setState: instance.setState,
  state: instance.state
});

export const getModeled = (options) => {
  const ComponentToExtend = options.isPure ? React.PureComponent : React.Component;

  return class Modeled extends ComponentToExtend {
    static displayName = 'Modeled';

    static propTypes = {
      __component: PropTypes.func.isRequired,
      __options: PropTypes.object.isRequired
    };

    static contextTypes = options.contextTypes;

    static childContextTypes = options.childContextTypes;

    constructor(props) {
      super(props);

      // context
      if (options.childContextTypes && options.getChildContext) {
        this.getChildContext = function() {
          return options.getChildContext(this.getModel(this.props));
        };
      }

      // state
      this.state = getInitialState(this);
      this.setState = this.setState.bind(this);

      // lifecycle methods
      addLifecycleMethod(this, 'componentWillMount');
      addLifecycleMethod(this, 'componentDidMount');
      addLifecycleMethod(this, 'componentWillReceiveProps', ['nextProps']);
      addLifecycleMethod(this, 'componentWillUpdate', ['nextProps', 'nextState']);
      addLifecycleMethod(this, 'componentDidUpdate', ['previousProps', 'previousState']);
      addLifecycleMethod(this, 'componentWillUnmount');

      if (!options.isPureComponent) {
        addLifecycleMethod(this, 'shouldComponentUpdate', ['nextProps', 'nextState']);
      }

      // instance values
      this.methods = getInstanceMethods(this, props.__options);

      // instance methods
      this.getDOMNode = createGetDOMNode(this);
      this.getModel = createGetModel(this);
    }

    render() {
      return this.props.__component(this.getModel(this.props));
    }
  };
};
