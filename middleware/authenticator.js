var jwt    = require('jwt-simple');
var moment = require('moment');
var _      = require('lodash');
var person = require('../domain_objects/person');
var key_manager = require('../helpers/jwt-key-manager');



/********************************** EXPORTS **********************************/
module.exports = {
	authenticate_token: authenticate_token,
	decode_token: decode_token,
	get_token_person: get_token_person,
	check_token_dates: check_token_dates,
	check_route_permissions: check_route_permissions,
	refresh_token_if_necessary: refresh_token_if_necessary
};




/******************************** MIDDLEWARE *********************************/

function authenticate_token(perms) {
	return [
		decode_token,
		get_token_person,
		check_token_dates,
		check_route_permissions(perms),
		refresh_token_if_necessary,
	];
}



function decode_token(req, res, next) {
	var secret = key_manager.get_key();
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
	person.read({
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


