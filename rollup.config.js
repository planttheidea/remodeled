import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import {uglify} from 'rollup-plugin-uglify';

const DEV_CONFIGURATION = {
  external: ['react', 'react-dom'],
  input: 'src/index.js',
  output: {
    exports: 'named',
    file: 'dist/remodeled.js',
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    name: 'Remodeled',
    sourcemap: true,
  },
  plugins: [
    resolve({
      mainFields: ['module', 'main'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

const PROD_CONFIGURATION = {
  external: ['react', 'react-dom'],
  input: 'src/index.js',
  output: {
    exports: 'named',
    file: 'dist/remodeled.min.js',
    format: 'umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    name: 'Remodeled',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    resolve({
      mainFields: ['module', 'main'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};

export default [DEV_CONFIGURATION, PROD_CONFIGURATION];
