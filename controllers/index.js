var express = require('express');
var router = express.Router();


require('./courses')(router);
require('./topics')(router);
//require('subscriptions.js')(router);
require('./videos')(router);
require('./video-chunks')(router);
require('./upload-tokens')(router);
require('./auth-tokens')(router);

//require('favorites.js')(router);

module.exports = router;
