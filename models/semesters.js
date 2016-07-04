var db    = require('../config/db_config');
var orm   = require('../helpers/orm');
var _     = require('lodash');
var table = 'semester';

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
		promise = promise.then(function (semesters) {
			if (_.isEmpty(semesters)) return {};
			else return semesters[0];
		});
	}
	
	return promise;
};