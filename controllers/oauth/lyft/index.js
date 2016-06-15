/* dependencies */
var nedb = require('nedb');
var path = require('path');

/* global configuration */
var config = require('../../../config/config');

/* database initialization */
var databaseLyftAuthorizations = new nedb({
  filename: path.join(__dirname, '../../../databases/lyft/authorizations.db'),
  autoload: true
});


/*================*/
/* Route Handlers */
/*================*/

exports.handleAuthorization = function (req, res, next) {
  console.log('===== handleAuthorization =====');
  var state = Date.now();
  databaseLyftAuthorizations.insert({
    'state': state
  }, function (err, doc) {
    console.log('err', err);
    console.log('doc', doc);
    res.redirect(
      config.LYFT_API_URI + '/oauth/authorize'
      + '?client_id='     + config.LYFT_CLIENT_ID
      + '&response_type=' + 'code'
      + '&scope='         + 'offline%20public%20profile%20rides.read%20rides.request'
      + '&state='         + state
    );
  });
};

exports.handleLanding = function (req, res, next) {
  console.log('===== handleLanding =====');
  databaseLyftAuthorizations.insert({
    'code': req.query.code,
    'state': req.query.state
  }, function (err, doc) {
    console.log('err', err);
    console.log('doc', doc);
    res.redirect('/');
  });
};

exports.handleRevocation = function (req, res, next) {
  res.redirect(
    config.LYFT_WWW_URI + '/connected-services'
  );
};
