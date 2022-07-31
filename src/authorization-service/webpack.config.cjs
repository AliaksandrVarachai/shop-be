const path = require('path');
const slsw = require('serverless-webpack');
const { IgnorePlugin } = require('webpack');

module.exports = {
  context: __dirname,
  entry: slsw.lib.entries,
  target: 'node',
  mode: process.env.NODE_ENV,
  module: {
    rules: [],
  },
  plugins: [
    // See: https://github.com/serverless-heaven/serverless-webpack/issues/78#issuecomment-720130181
    new IgnorePlugin({ resourceRegExp: /^pg-native$/ }),
  ],
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
}
