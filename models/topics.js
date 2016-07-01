var db = require('../config/db_config');
var orm = require('../helpers/orm');
var generate_uuid = require('../helpers/uuid');
var table = 'topic';

exports.get_some = function (args) {
	var promise = orm.select({
		db:     db, 
		table:  table,  
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});
	return promise;
};

exports.get_one = function (args) {
	var promise = orm.select({
		db: db,
		table: table,
		where: {items: {id: args.id}, delimiter: 'AND'},
		qrm: 'one'
	});
	return promise;
};