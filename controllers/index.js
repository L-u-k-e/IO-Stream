var express = require('express');
var router = express.Router();

//require('users.js')(router);
require('./courses.js')(router);
//require('subscriptions.js')(router);
//require('videos.js')(router);
//require('favorites.js')(router);

router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, '../public')} );
});

module.exports = router;
