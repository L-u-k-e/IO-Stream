var db = require('../config/db_config');
var orm = require('../helpers/orm');
var table = 'video';


exports.get_all = function (req, res, next) {

};



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
}



exports.update = function (args) {
	var promise = orm.update({
		db:    db, 
		table: 'video', 
		set:   args.set, 
		where: args.where
	});
	return promise;
}


exports.create = function (values) {
	var promise = orm.insert( {
		db:    db, 
		table: 'video',
		values: values
	});
	return promise;
};