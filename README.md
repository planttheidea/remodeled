# remodeled

An abstraction for the React API with functional purity

## Table of contents

- [Summary](#summary)
- [Usage](#usage)
- [Options](#options)
- [Model](#model)
  - [Lifecycle methods](#lifecycle-methods)
  - [State](#state)
  - [Instance methods](#instance-methods)
  - [Child context](#child-context)
- [Use with other decorators](#use-with-other-decorators)
- [Browser support](#browser-support)
- [Development](#development)

# DEPRECATION NOTICE

This library has been deprecated in favor of [`react-parm`](https://github.com/planttheidea/react-parm), which can accomplish all the same feats with `createComponent` that this library does without breaking the contract for components.

## Summary

React is a solid, performant implementation of the virtual DOM, and as takes a large number of influences from functional programming to attain it. That said, for components that require heavy lifting (lifecycle hooks, internal state, etc.), you are expected to extend the component `class`, which allows for the same pitfalls that object-oriented programming allow.

`remodeled` is a thin abstraction layer re-implementing the existing React API in a way that allows for functional purity. keeping concerns separated and improving testability. All aspects of the component instance are available via the `model` passed to all methods in a single object parameter, and rendering is always handled with simple, functional components.

## Usage

```javascript
import React from "react";
import model from "remodeled";

const componentDidMount = ({ state }) => console.log(state.showChildren);

const initialState = {
  showChildren: false
};

const onClickButton = ({ setState }) =>
  setState(({ showChildren }) => ({ showChildren: !showChildren }));

const App = ({ methods, props, state }) => (
  <div>
    <h1>Toggle those children</h1>

    <button onClick={methods.onClickButton}>Click to toggle</button>

    {state.showChildren && props.children}
  </div>
);

export default model({ componentDidMount, initialState, onClickButton })(App);
```

## Options

All aspects of the instance can be passed via the `options` object to the decorator. All of the following are available:

```javascript
{
  childContextTypes: Object, // the childContextTypes to apply to the options (can also be applied to the component)
  componentWillMount: Function, // lifecycle method called prior to mount
  componentDidMount: Function, // lifecycle method called after mount
  componentWillReceiveProps: Function, // lifecycle method called when receiving new props
  componentWillUpdate: Function, // lifecycle method called prior to update
  componentDidUpdate: Function, // lifecycle method called after update
  componentWillUnmount: Function, // lifecycle method called prior to unmount
  contextTypes: Object, // the contextTypes to apply to the options (can also be applied to the component)
  getChildContext: Function, // method to get child context
  isPureComponent: boolean, // is the instance using the PureComponent optimization
  shouldComponentUpdate: Function // lifecycle method to determine if component should update
}
```

Additional function properties provided will be treated as [`instance methods`](#instance-methods). All methods receive the full [`model`](#model) object, and for specific lifecycle methods additional properties are provided when appropriate (see [`lifecycle methods`](#lifecycle-methods).

## Model

`remodeled` is inspired by the interface provided by [`deku`](https://github.com/anthonyshort/deku), where all instance properities are provided as a single object parameter. This consistent interface provides self-documenting code through the use of [`destructuring`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) and facilitates encapsulation and testability.

The model properties passed to all functions are:

```javascript
  context: Object, // the context requested in contextTypes
  getDOMNode: Function, // helper function to get the instance DOM node
  methods: Object, // object of instance methods added
  props: Object, // the props passed to the instance
  setState: Function, // the method by which to set the state
  state: Object // the internal state of the instance
```

Most of these are the same properties you know from React, but encapsulated for convenience. `getDOMNode` is a convenience method to be used in place of `findDOMNode(this)`, and `methods` is a namespace for all instance methods passed.

#### Lifecycle methods

In addition to the `model` properties, certain lifecycle methods will include the following:

**componentWillReceiveProps**

```javascript
nextProps: Object; // the props passed to the instance used in the next render
```

**shouldComponentUpdate**

_not applicable when `isPureComponent` is `true`_

```javascript
nextProps: Object, // the props passed to the instance used in the next render
nextState: Object // the internal state of the instance used in the next render
```

**componentWillUpdate**

```javascript
nextProps: Object, // the props passed to the instance used in the next render
nextState: Object // the internal state of the instance used in the next render
```

**componentDidUpdate**

```javascript
previousProps: Object, // the props passed to the instance used in the previous render
previousState: Object // the internal state of the instance used in the previous render
```

#### State

State operates just like the standard `class` component, with the exception of the access being from the model.

```javascript
const onClickButton = ({ setState, state }) =>
  setState(({ isToggled }) => ({ isToggled: !isToggled }));
```

#### Instance methods

Any method declared on the [`options`](#options) that is not a known lifecycle method is considered an instance method, and will be available under the `methods` property in the `model`.

```javascript
const onClickButton = ({ setState, state }) =>
  setState(({ isToggled }) => ({ isToggled: !isToggled }));
...
const Button = ({methods}) =>
  <button onClick={methods.onClickButton}>Click me!</button>;
```

In addition to the `model` properties, instance methods will include the following:

```javascript
args: Array<any> // the arguments passed to the method when called
```

#### Child context

Unlike standard functional components, with `remodeled` you can create child context! Just pass `childContextTypes` and `getChildContext` options.

```javascript
const childContextTypes = { hello: PropTypes.string };

const getChildContext = model => ({ hello: model.props.greeting });
```

## Use with other decorators

When composing multiple decorators, make sure that `model` is the first decorator applied. For example:

```javascript
export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  model() // last in the order of compose means it is the first decorator applied
)(MyComponent);
```

Because of the transformation that is made to the API, you will likely experience breakages with these higher-order components if you are not mindful of order.

## Browser support

- Chrome (all versions)
- Firefox (all versions)
- Edge (all versions)
- Opera 15+
- IE 9+
- Safari 6+
- iOS 8+
- Android 4+

## Development

Standard stuff, clone the repo and `npm install` dependencies. The npm scripts available:

- `build` => run webpack to build development `dist` file with NODE_ENV=development
- `build:minified` => run webpack to build production `dist` file with NODE_ENV=production
- `dev` => run webpack dev server to run example app / playground
- `dist` => runs `build` and `build:minified`
- `lint` => run ESLint against all files in the `src` folder
- `prepublish` => runs `prepublish:compile` when publishing
- `prepublish:compile` => run `lint`, `test:coverage`, `transpile:es`, `transpile:lib`, `dist`
- `test` => run AVA test functions with `NODE_ENV=test`
- `test:coverage` => run `test` but with `nyc` for coverage checker
- `test:watch` => run `test`, but with persistent watcher
- `transpile:lib` => run babel against all files in `src` to create files in `lib`
- `transpile:es` => run babel against all files in `src` to create files in `es`, preserving ES2015 modules (for
  [`pkg.module`](https://github.com/rollup/rollup/wiki/pkg.module))
