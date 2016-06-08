/* dependencies */
var express = require('express');
var path = require('path');

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
app.get('/', function(req, res, next) {
  res.render('index', {GOOGLE_API_KEY: config.GOOGLE_API_KEY});
  next();
});
app.all('/oauth/redirect', function(req, res, next) {
  res.redirect('/');
  next();
});

/* express initialization */
app.listen(config.PORT, function() {
  console.log(
    'lyft-node-starter-kit running' +
    '\n' + ' => http://localhost:' + config.PORT +
    '\n' + ' => [ ctrl + c ] to quit'
  );
});
