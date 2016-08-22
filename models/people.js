var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var _             = require('lodash');
var bluebird      = require('bluebird');
var bcrypt        = require('bcrypt');
var model_factory = require('../helpers/model-factory');
var compare       = bluebird.promisify(bcrypt.compare);

var table = 'person';
var public_properties = ['id', 'publisher', 'admin', 'first_name', 'last_name'];

exports.get = model_factory.retrieve({
	table: table,
	public_properties: public_properties
});


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