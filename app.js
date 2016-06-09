/* dependencies */
var express = require('express');
var path    = require('path');
var request = require('request');

/* global configuration */
var config = require('./config/config');

/* express configuration */
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/* express middleware */
app.use(
  express.static(
    path.join(__dirname, 'public'),
    {maxAge: 31557600000}
  )
);
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

/* express routing */
app.get('/api/status', function(req, res, next) {
  res.json({status: 'default', timestamp: Date.now()});
});
app.get('/api/remote-status', function(req, res, next) {
  request.get(config.LYFT_API_URI, function (error, response, body) {
    if (error) {
      res.json({status: 'error', error: error});
    } else {
      var timestamp = response.headers['date'] ? (new Date(response.headers['date'])).getTime() : '';
      res.json({status: 'default', timestamp: timestamp});
    }
  });
});
app.get('/', function(req, res, next) {
  res.render('index', {GOOGLE_API_KEY: config.GOOGLE_API_KEY});
});
app.all('/oauth/redirect', function(req, res, next) {
  res.redirect('/');
});

/* express initialization */
app.listen(config.PORT, function() {
  console.log(
    'lyft-node-starter-kit running' +
    '\n' + ' => http://localhost:' + config.PORT +
    '\n' + ' => [ ctrl + c ] to quit'
  );
});
