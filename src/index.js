// external dependencies
import PropTypes from 'prop-types';
import React from 'react';

// classes
import {getModeled} from './Modeled';

// constants
import {OPTIONS_PROP_TYPES} from './constants';

/**
 * @function model
 *
 * @description
 * create a modeled functional component based on the options passed
 *
 * @param {Object} [options={}] the options passed to generate the model
 * @returns {function(ReactComponent): ReactComponent} the decorated component
 */
export default function model(options = {}) {
  PropTypes.checkPropTypes(OPTIONS_PROP_TYPES, options, 'option', 'options');

  return (component) => {
    const coalescedOptions = {
      ...options,
      childContextTypes: options.childContextTypes || component.childContextTypes,
      contextTypes: options.contextTypes || component.contextTypes
    };
    const Modeled = getModeled(coalescedOptions);

    function ModeledWrapper(props) {
      return (
        /* eslint-disable prettier */
        <Modeled
          {...props}
          __component={component}
          __options={coalescedOptions}
        />
        /* eslint-enable */
      );
    }

    ModeledWrapper.displayName = `Modeled(${component.displayName || component.name || 'Component'})`;

    return ModeledWrapper;
  };
}
