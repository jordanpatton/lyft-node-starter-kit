/* global configuration */
var config = require('../../../config/config');


/*================*/
/* Route Handlers */
/*================*/

exports.handleAuthorization = function (req, res, next) {
  var state = Date.now();
  res.redirect(
    config.LYFT_API_URI + '/oauth/authorize'
    + '?client_id='     + config.LYFT_CLIENT_ID
    + '&response_type=' + 'code'
    + '&scope='         + 'offline%20public%20profile%20rides.read%20rides.request'
    + '&state='         + state
  );
};

exports.handleLanding = function (req, res, next) {
  console.log('===== /oauth/lyft/landing =====');
  res.redirect('/');
};

exports.handleRevocation = function (req, res, next) {
  res.redirect(
    config.LYFT_WWW_URI + '/connected-services'
  );
};
