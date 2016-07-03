var db    = require('../config/db_config');
var orm   = require('../helpers/orm');
var _     = require('lodash');
var table = 'person';

exports.get = function (args) {
	args = args || {};
	var inflection = args.inflection;
	if (!_.includes(['many', 'one'], inflection)) inflection = 'many';

	var promise = orm.select({
		db:     db, 
		table:  table,
		qrm:    inflection,  
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});
	
	return promise;
};