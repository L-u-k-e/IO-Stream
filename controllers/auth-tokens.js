var people = require('../models/people');
var token = require('../helpers/token');

var authenticate = function (req, res, next) {
	var creds = {user: req.body.user, password: req.body.password};
	people.authenticate(creds)
	.then(function (result) {
		if (!result.valid) { 
			res.status(401).json({message: "Invalid username or password."});
		} else {
			var fresh_token = token.new(result.user);
			res.status(201).append('authorization', fresh_token).json({message: "Created a new authentication token."});
		}
	});
};


module.exports = function (router) {
	router.post('/api/auth-tokens', authenticate);
}