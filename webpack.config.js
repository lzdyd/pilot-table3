const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';
const CONTEXT = process.env.NODE_ENV === 'development' ? '/' : '/fok-ui/';

require('babel-polyfill');

console.log('Dev build');

module.exports = {
  context: path.join(__dirname, '\\src'),

  entry: [
		'babel-polyfill',
    'webpack-hot-middleware/client',
    './index'
  ],

  output: {
    path: path.join(__dirname, '/public/assets/js'),
    publicPath: '/assets/js/',
    filename: '[name].js'
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      api: path.resolve(__dirname, 'src/services/api'),
      actions: path.resolve(__dirname, 'src/actions')
    }
  },

  devtool: NODE_ENV === 'development' ? 'eval' : false,

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      CONTEXT: JSON.stringify(CONTEXT)
    }),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loaders: ['react-hot-loader', 'babel-loader'],
      include: path.join(__dirname, 'src')
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader' // creates style nodes from JS strings
      }, {
        loader: 'css-loader' // translates CSS into CommonJS
      }, {
        loader: 'sass-loader' // compiles Sass to CSS
      }]
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    }, {
      test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'file-loader?name=[path][name].[ext]'
    }]
  }
};
