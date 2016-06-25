var express = require('express');
var router = express.Router();

//require('users.js')(router);
require('./courses.js')(router);
//require('subscriptions.js')(router);
require('./videos.js')(router);
require('./video-chunks.js')(router);
require('./upload-tokens.js')(router);

//require('favorites.js')(router);

module.exports = router;
