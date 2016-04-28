var db = require('../config/db_config.js');
var orm = require('../helpers/orm.js');

exports.get_all = function (req, res, next) {

};
/*
exports.create = function (req, res, next) {
  orm.insert(db, 'video', req.sql)
	.then(function (data) {
		req.query_result = data;
		next();
	})
	.catch(function (err) {
		return next(err);
	});

};*/

exports.update = function (req, res, next) {
	orm.update(db, 'video', req.sql.set, req.sql.where)
	.then(function () { next(); })
	.catch(function(err) { next(err); })
}


exports.create = function (values) {
	var promise = orm.insert( {
		db:    db, 
		table: 'video',
		values: values
	});
	return promise;
};