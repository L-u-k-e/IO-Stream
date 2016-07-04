var db    = require('../config/db_config');
var orm   = require('../helpers/orm');
var _     = require('lodash');
var table = 'person';

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