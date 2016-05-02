/* dependencies */
var express = require('express');
var path = require('path');

/* configuration */
var config = require('./config/config');

/* server definition */
var app = express();

/* middleware */
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

/* routing */
app.all('/oauth/redirect', function(req, res, next) {
  console.log('/oauth/redirect');
  res.redirect('/');
  next();
});

/* initialization */
app.listen(config.PORT, function() {
  console.log(
    'lyft-node-starter-kit running' +
    '\n' + ' => http://localhost:' + config.PORT +
    '\n' + ' => [ ctrl + c ] to quit'
  );
});
