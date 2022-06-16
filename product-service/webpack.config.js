const path = require('path');
const slsw = require('serverless-webpack');

module.exports = {
  context: __dirname,
  entry: slsw.lib.entries,
  target: 'node',
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [
      //     { loader: 'babel-loader' }
      //   ]
      // },
    ],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
}