var jwt = require('jwt-simple');
var secret = 'donuts'

exports.new = function (user) {
	var payload = {user: user};
	var token = jwt.encode(payload, secret);
	return token;
};

exports.auth = function (perms) {
	var middleware = function (req, res, next) {
		try {
			var cookie = req.cookies.auth-token;
			console.log(cookie);
			var payload = jwt.decode(cookie, secret);
			console.log(payload);
			next();
		} catch (err) {
			res.status(401).json({message: 'Invalid or non-existant authentication token.'})
		}
	};
	return middleware;
};