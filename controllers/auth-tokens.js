var people = require('../models/people');

var authenticate = function (req, res, next) {
	var creds = {user: req.body.user, password: req.body.password};
	people.authenticate(creds)
	.then(function (result) {
		var status = result.valid ? 202: 401; 
		res.sendStatus(status);
	});
};

var create_token = function (req, res, next) {

};

var send_token = function (req, res, next) {

};

module.exports = function (router) {
	router.post('/api/auth-tokens',
		authenticate, 
		create_token, 
		send_token
	);
}