var jwt = require('jwt-simple');
var _   = require('lodash');

var secret = 'donuts';

exports.new = function (user) {
	var payload = {user: user};
	var token = jwt.encode(payload, secret);
	return token;
};

exports.auth = function (perms) {
	var middleware = function (req, res, next) {
		try {
			var token = req.headers.authorization;
			var payload = jwt.decode(token, secret);

			var has_perm = function (perm) {
				var prop = _.snakeCase(perm);
				var has = !!payload.user[prop];
				return has;
			};

			if (_.every(perms, has_perm)) next();
			else res.status(401).json({message: 'Insufficient permissions.'});
			
		} catch (err) {
			res.status(401).json({message: 'Invalid or non-existant authentication token.'});
		}
	};
	return middleware;
};
