var people = require('../models/people');
var token = require('../helpers/token');

var authenticate = function (req, res, next) {
	var creds = {user: req.body.user, password: req.body.password};
	people.authenticate(creds)
	.then(function (result) {
		if (!result.valid) { 
			res.status(401).json({message: "invalid username or password"});
		} else {
			var fresh_token = token.new(result.user);
			var cookie_opts = { maxAge: (1000 * 60 * 60 * 24 * 7), httpOnly: true };
			res.cookie('auth_token', fresh_token, cookie_opts);
			res.status(201).json({message: "created a new authentication token"});
		}
	});
};


module.exports = function (router) {
	router.post('/api/auth-tokens', authenticate);
}