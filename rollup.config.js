import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import multiEntry from 'rollup-plugin-multi-entry'
import istanbul from 'rollup-plugin-istanbul'
import pkg from './package.json'
import { terser } from "rollup-plugin-terser";

const {main} = pkg


export default [{
  input: 'src/datafield.js',
  output: {
    file: main,
    name: 'lib',
    sourcemap: true,
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    buble()
  ]
}, {
  input: 'test/test.js',
  output: {
    file: 'dist/tests.bundle.js',
    name: 'lib',
    sourcemap: true,
    format: 'iife',
    globals: {
      chai: 'chai',
      it: 'it',
      describe: 'describe'
    }
  },
  external: ['chai', 'it', 'describe'],
  plugins: [
    resolve(),
    istanbul({
      exclude: ['test/*.js', 'node_modules/**/*']
    }),
    commonjs(),
    multiEntry(),
    buble()
  ]
}]