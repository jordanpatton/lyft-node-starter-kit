/*================*/
/* Route Handlers */
/*================*/

exports.getStatus = function (req, res, next) {
  res.json({meta: {success: true, timestamp: Date.now()}, status: 'happy'});
};

exports.getUsers = function (req, res, next) {
  res.json({
    meta: {
      success: true
    },
    user: {
      hasLyftAuthorizationCode: !!(req.session.lyftAuthorizationCode),
      lyftStatus: req.session.lyftStatus ? req.session.lyftStatus : null
    }
  });
};
