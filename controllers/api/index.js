/*================*/
/* Route Handlers */
/*================*/

exports.getStatus = function (req, res, next) {
  res.json({status: 'default', timestamp: Date.now()});
};
