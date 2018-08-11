import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import pkg from './package.json'
import { terser } from 'rollup-plugin-terser'

const {main} = pkg

export default [{
  input: 'src/datafield.js',
  output: {
    file: main,
    name: 'DataField',
    sourcemap: true,
    format: 'umd'
  },
  plugins: [
    resolve(),
    commonjs(),
    terser(),
    buble()
  ]
}]
