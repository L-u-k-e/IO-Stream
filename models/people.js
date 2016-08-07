var db       = require('../config/db_config');
var orm      = require('../helpers/orm');
var _        = require('lodash');
var bluebird = require('bluebird');
var bcrypt   = require('bcrypt');
var compare  = bluebird.promisify(bcrypt.compare);

var table    = 'person';

exports.get = function (args) {
	args = args || {};

	var promise = orm.select({
		db:     db, 
		table:  table,
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});
	
	if (args.inflection === 'one') {
		promise = promise.then(function (people) {
			if (_.isEmpty(people)) return {};
			else return people[0];
		});
	}
	return promise;
};


exports.authenticate = function (args) {
	return orm.select({
		db: db,
		table: table,
		where: {id: args.user},
		qrm: 'one'
	})
	.then(function (user) {
		return compare(args.password, user.hash)
		.then(function (same) {
			var public_props = ['id', 'faculty', 'super_user', 'first_name', 'last_name'];
			var auth_info = { valid: same, user: _.pick(user, public_props) };
			return auth_info;
		});
	})
	.catch(function (err) {
		console.log(err);
		var auth_info = { valid: false };
		return auth_info;
	});

};