import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import istanbul from 'rollup-plugin-istanbul';
import resolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
  entry: 'lib/index.js',
  plugins: [
    resolve(),
    babel(babelrc()),
    istanbul({
      exclude: ['test/**/*', 'node_modules/**/*']
    }),
  ],
  external: ['crypto', 'qs', 'url-parse'],
  targets: [
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
  ]
};
