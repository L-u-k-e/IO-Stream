var jwt    = require('jwt-simple');
var moment = require('moment');
var key_manager = require('./jwt-key-manager');

module.exports = {
	new: create_token
};

function create_token(user) {
	var secret = key_manager.get_key();
	var now = moment();
	var payload = {
		iat: now.format('X'),
		exp: now.add(7, 'days').format('X'),
		user: user
	};
	var token = jwt.encode(payload, secret);
	return token;
}