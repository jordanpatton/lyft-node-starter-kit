/* dependencies */
var express = require('express');
var path = require('path');

/* configuration: port */
var CONFIG_PORT = parseInt((process.env.CONFIG_PORT || 3000), 10);
if (isNaN(CONFIG_PORT)) {
  console.log('invalid port:', CONFIG_PORT);
  process.exit(1);
}

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

/* initialization */
app.listen(CONFIG_PORT, function() {
  console.log(
    'lyft-node-starter-kit running' +
    '\n' + ' => http://localhost:' + CONFIG_PORT +
    '\n' + ' => [ ctrl + c ] to quit'
  );
});
