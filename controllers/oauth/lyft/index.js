/* global configuration */
var config = require('../../../config/config');


/*================*/
/* Route Handlers */
/*================*/

exports.handleAuthorization = function (req, res, next) {
  console.log('===== /oauth/lyft/authorization =====');
  res.redirect('/');
};

exports.handleLanding = function (req, res, next) {
  console.log('===== /oauth/lyft/landing =====');
  res.redirect('/');
};

exports.handleRevocation = function (req, res, next) {
  console.log('===== /oauth/lyft/revocation =====');
  res.redirect('/');
};
