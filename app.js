/* dependencies */
var express = require('express');
var path    = require('path');

/* global configuration */
var config = require('./config/config');

/* controllers */
var apiController     = require('./controllers/api');
var apiLyftController = require('./controllers/api/lyft');

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

/* express routing: api routes */
app.get('/api/status',      apiController.getStatus);
app.get('/api/lyft/status', apiLyftController.getStatus);
app.get('/api/lyft/eta',    apiLyftController.getEta);

/* express routing: render routes */
app.get('/', function(req, res, next) {
  res.render('index', {GOOGLE_API_KEY: config.GOOGLE_API_KEY});
});
app.all('/oauth/redirect', function(req, res, next) {
  res.redirect('/');
});

/* express invocation */
app.listen(config.PORT, function() {
  console.log([
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'lyft-node-starter-kit running',
    ' => http://localhost:' + config.PORT,
    ' => [ ctrl + c ] to quit',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  ].join('\n'));
});
