// external dependencies
import PropTypes from 'prop-types';

/**
 * @constant {Array<string>} IGNORED_PROPS the props that are passed into the model
 */
export const IGNORED_PROPS = ['__component', '__options'];

/**
 * @constant {Array<string>} LIFECYCLE_METHODS the lifecycle methods for react
 */
export const LIFECYCLE_METHODS = [
  'getChildContext',
  'componentWillMount',
  'componentDidMount',
  'componentWillReceiveProps',
  'shouldComponentUpdate',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
];

/**
 * @constant {Object} OPTIONS_PROP_TYPES the prop types for checking the options
 */
export const OPTIONS_PROP_TYPES = {
  componentDidMount: PropTypes.func,
  componentDidUpdate: PropTypes.func,
  componentWillMount: PropTypes.func,
  componentWillReceiveProps: PropTypes.func,
  componentWillUnmount: PropTypes.func,
  componentWillUpdate: PropTypes.func,
  initialState: PropTypes.object,
  isPureComponent: PropTypes.bool,
  shouldComponentUpdate: PropTypes.func
};
