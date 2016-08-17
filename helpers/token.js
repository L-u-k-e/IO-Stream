var jwt    = require('jwt-simple');
var moment = require('moment');
var _      = require('lodash');
var people = require('../models/people');

var secret = 'donuts';





/******************************** MIDDLEWARE *********************************/

function make_token(user) {
	var secret = get_secret_key();
	console.log(secret);
	var now = moment();
	var payload = {
		iat: now.format('X'),
		exp: now.add(7, 'days').format('X'),
		user: user
	};
	var token = jwt.encode(payload, secret);
	return token;
};



function auth(perms) {
	return [
		decode_token,
		get_token_person,
		check_token_dates,
		check_route_permissions(perms),
		refresh_token_if_necessary,
	];
}



function decode_token(req, res, next) {
	var secret = get_secret_key();
	try {
		var token = {encoded: req.headers.authorization};
		token.decoded = jwt.decode(token.encoded, secret);
		res.locals.token = token;
		next();
	} catch (err) {
		// signature doesn't match
		send_invalid(res, 401);
	}
}



function get_token_person(req, res, next) {
	people.get({
		inflection: 'one',
		where: {id: res.locals.token.decoded.user.id}
	}).then(function (person) {
		res.locals.person = person;
		next();
	}).catch(function (err) {
		// user was deleted after the token was issued
		send_invalid(res, 401);
	});	
}



function check_token_dates(req, res, next) {
	var dates = get_key_dates(res);
	if (dates.issue_date.isAfter(dates.valid_after) && dates.issue_date.isBefore(dates.exp_date)) next();
	else send_invalid(res, 401);
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
	var dates = get_key_dates(res);
	var lapsed = dates.issue_date.diff(moment(), 'days');
	if (lapsed >= 1) res.headers.authentication = make_token(res.person);
	next();
}





/********************************** HELPERS **********************************/

function get_secret_key() {
	return process.env.jwt_secret_key;
}



function get_key_dates(res) {
	var dates = {
		valid_after: moment(res.locals.person.last_token_invalidation),
		issue_date: moment.unix(res.locals.token.decoded.iat),
		exp_date: moment.unix(res.locals.token.decoded.exp)
	};
	return dates;
}



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
	get_token_person: get_token_person,
	check_token_dates: check_token_dates,
	check_route_permissions: check_route_permissions,
	refresh_token_if_necessary: refresh_token_if_necessary
};