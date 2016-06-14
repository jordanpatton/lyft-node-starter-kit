/* dependencies */
var request = require('request');

/* global configuration */
var config = require('../../../config/config');


/*================*/
/* Helper Methods */
/*================*/

var requestWithBearerToken = function (res, options, callback) {
  /* begin: pre-auth request */
  request({
    method: 'POST',
    uri: config.LYFT_API_URI + '/oauth/token',
    auth: {
      username: config.LYFT_CLIENT_ID,
      password: (config.USE_SANDBOX ? 'SANDBOX-' : '') + config.LYFT_CLIENT_SECRET
    },
    json: {
      grant_type: 'client_credentials',
      scope: 'offline public profile rides.read rides.request'
    }
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


/*================*/
/* Route Handlers */
/*================*/

exports.getStatus = function (req, res, next) {
  request.get(config.LYFT_API_URI + '/v1', function (error, response, body) {
    if (error) {
      res.json({status: 'error', error: error});
    } else {
      var timestamp = response.headers['date'] ? (new Date(response.headers['date'])).getTime() : '';
      res.json({status: 'default', timestamp: timestamp});
    }
  });
};

exports.getEta = function (req, res, next) {
  requestWithBearerToken(res, {
    method: 'GET',
    uri: config.LYFT_API_URI + '/v1/eta',
    json: true,
    qs: {lat: req.query.lat, lng: req.query.lng}
  });
};

exports.getProfile = function (req, res, next) {
  requestWithBearerToken(res, {
    method: 'GET',
    uri: config.LYFT_API_URI + '/v1/profile',
    json: true
  });
};

exports.getRides = function (req, res, next) {
  requestWithBearerToken(res, {
    method: 'GET',
    uri: config.LYFT_API_URI + '/v1/rides',
    json: true,
    qs: {start_time: req.query.start_time, end_time: req.query.end_time}
  });
};
