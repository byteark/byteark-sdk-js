import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
  entry: 'lib/index.js',
  plugins: [
    resolve(),
    babel(babelrc()),
  ],
  external: ['crypto', 'qs', 'url-parse'],
  targets: [
    {
      dest: pkg.cjs,
      format: 'cjs'
    },
    {
      dest: pkg.main,
      format: 'umd',
      moduleName: 'bytearkSdk',
      sourceMap: true
    },
    {
      dest: pkg.module,
      format: 'es',
      sourceMap: true
    }
  ],
  globals: {
    crypto: 'crypto',
    qs: 'qs',
    'url-parse': 'urlParse'
  }
};
