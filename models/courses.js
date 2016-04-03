var db = require('../config/db_config.js');


exports.get_all = function (req, res, next) {
	db.any('select * from course')
	.then(function (data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrieved all courses'
		});
		next();
	})
	.catch(function (err) {
		return next(err);
	});
};

exports.get = function (req, res, next) {
	db.one('select * from course where id = $1', req.params.id)
	.then(function (data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Retrieved a course'
		});
	})
	.catch(function (err) {
		console.log(err);
		return next(err);
	});
};

exports.create = function (req, res, next) {

};

exports.update = function (req, res, next) {

};

exports.delete = function (req, res, next) {

};