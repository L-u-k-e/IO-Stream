var jwt    = require('jwt-simple');
var moment = require('moment');
var _      = require('lodash');
var people = require('../models/people');

var secret = 'donuts';





/******************************** MIDDLEWARE *********************************/

var make_token = function(user) {
	var payload = {
		iat: moment().format('X'),
		user: user};
	var token = jwt.encode(payload, secret);
	return token;
};


function auth(perms) {
	return [
		decode_token,
		check_token_expiry,
		check_route_permissions(perms),
		refresh_token_if_necessary,
	];
}


function decode_token(req, res, next) {
	try {
		var token = {encoded: req.headers.authorization};
		token.decoded = jwt.decode(token.encoded, secret);
		res.locals.token = token;
		next();
	} catch (err) {
		send_invalid(res, 401);
	}
}


function check_token_expiry(req, res, next) {
	people.get({
		inflection: 'one',
		where: {id: res.locals.token.decoded.user.id}
	}).then(function (person) {
		console.log(moment(person.last_token_invalidation).format('X'));
		next();
	}).catch(function (err) {
		send_invalid(res, 401);
	});	
}


function check_route_permissions(perms) {
	perms = perms || [];
	return function (req, res, next) {
		var user_has_perm = _.partial(has_perm, res.locals.token.decoded.user);
		if (_.every(perms, user_has_perm)) next();
		else send_invalid(res, 403);
	};
}


function refresh_token_if_necessary(req, res, next) {
	next();
}





/********************************** HELPERS **********************************/

function has_perm(user, perm) {
	var prop = _.snakeCase(perm);
	var has = !!user[perm];
	return has;
}


function send_invalid(res, status) {
	var message = '';
	if (status == 401) message = 'Invalid or non-existant authentication token.';
	else if (status == 403) message = 'Insufficient permissions.';
	res.status(status).json({message: message});
}





/********************************** EXPORTS **********************************/
module.exports = {
	new: make_token,
	auth: auth,
	decode_token: decode_token,
	check_token_expiry: check_token_expiry,
	check_route_permissions: check_route_permissions,
	refresh_token_if_necessary: refresh_token_if_necessary
};