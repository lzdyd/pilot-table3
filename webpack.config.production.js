const path = require('path');
const webpack = require('webpack');

const NODE_ENV = process.env.NODE_ENV || 'development';
const CONTEXT = '/fok-ui/';

require('babel-polyfill');

console.log('Production build');

// TODO: make improvements

module.exports = {
  context: path.join(__dirname, '\\src'),

  entry: [
  	'babel-polyfill',
    './index'
  ],

  output: {
    path: path.join(__dirname, '/src/main/webapp'),
    publicPath: '/',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      api: path.resolve(__dirname, 'src/services/api'),
      actions: path.resolve(__dirname, 'src/actions')
    }
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      CONTEXT: JSON.stringify(CONTEXT)
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    })
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
