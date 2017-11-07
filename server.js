const path = require('path');
const webpack = require('webpack');
const express = require('express');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/doc-data_opu.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doc-data_opu.json'));
});

app.get('/doctype_opu.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doctype_opu.xml'));
});

app.get('/doctype_view_opu.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doctype_view_opu.xml'));
});

app.get('/doc-data_balance.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doc-data_balance.json'));
});

app.get('/doctype_balans.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doctype_balans.xml'));
});

app.get('/doctype_view_balans_edit.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/doctype_view_balans_edit.xml'));
});

app.get('/dataTable.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs/dataTable.json'));
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }

  console.log('Listening at http://localhost:3000/');
});
