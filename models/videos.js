var db = require('../config/db_config.js');
var orm = require('../helpers/orm.js');

exports.get_all = function (req, res, next) {

};


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