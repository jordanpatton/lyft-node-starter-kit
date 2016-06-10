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

/* express routing: status routes */
app.get('/api/status', function(req, res, next) {
  res.json({status: 'default', timestamp: Date.now()});
});
app.get('/api/lyft/status', function(req, res, next) {
  request.get(config.LYFT_API_URI+'/v1', function (error, response, body) {
    if (error) {
      res.json({status: 'error', error: error});
    } else {
      var timestamp = response.headers['date'] ? (new Date(response.headers['date'])).getTime() : '';
      res.json({status: 'default', timestamp: timestamp});
    }
  });
});

/* express routing: lyft api request helper */
var requestAuthenticated = function (res, options, callback) {
  /* begin: pre-auth request */
  request({
    method: 'POST',
    uri: config.LYFT_API_URI + '/oauth/token',
    auth: {
      username: config.LYFT_CLIENT_ID,
      password: (config.USE_SANDBOX ? 'SANDBOX-' : '') + config.LYFT_CLIENT_SECRET
    },
    json: {grant_type: 'client_credentials'}
  }, function (preAuthError, preAuthResponse, preAuthBody) {
    if (preAuthError) {
      res.json({meta: {success: false, error: preAuthError}});
    } else {
      /* begin: post-auth request */
      options = options || {};
      options.auth = options.auth || {bearer: preAuthBody.access_token};
      callback = callback || function (postAuthError, postAuthResponse, postAuthBody) {
        if (postAuthError) {
          res.json({meta: {success: false, error: postAuthError}});
        } else {
          postAuthBody = postAuthBody || {};
          postAuthBody.meta = {success: true};
          res.json(postAuthBody);
        }
      };
      request(options, callback);
      /* end: post-auth request */
    }
  });
  /* end: pre-auth request */
};

/* express routing: api routes */
app.get('/api/lyft/eta', function(req, res, next) {
  requestAuthenticated(res, {
    method: 'GET',
    uri: config.LYFT_API_URI + '/v1/eta',
    json: true,
    qs: {lat: req.query.lat, lng: req.query.lng}
  });
});

/* express routing: render routes */
app.get('/', function(req, res, next) {
  res.render('index', {GOOGLE_API_KEY: config.GOOGLE_API_KEY});
});
app.all('/oauth/redirect', function(req, res, next) {
  res.redirect('/');
});

/* express initialization */
app.listen(config.PORT, function() {
  console.log(
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'       + '\n' +
    'lyft-node-starter-kit running'       + '\n' +
    ' => http://localhost:' + config.PORT + '\n' +
    ' => [ ctrl + c ] to quit'            + '\n' +
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  );
});
