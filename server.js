const path = require('path');
const webpack = require('webpack');
const express = require('express');

const isDev = (process.env.NODE_ENV !== 'production');

const app = express();

if (!isDev) {
  const config = require('./webpack.config.production');
  const compiler = webpack(config);

  compiler.run((err, stats) => {
    console.log(`Bundle is build. Path to the bundle: ${config.output.path}`);
  });
}

if (isDev) {
  const config = require('./webpack.config');
  const compiler = webpack(config);

  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  app.listen(3000, (err) => {
    if (err) {
      return console.error(err);
    }

    console.log('Listening at http://localhost:3000/');
  });
}
