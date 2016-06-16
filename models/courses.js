var db = require('../config/db_config.js');
var orm = require('../helpers/orm.js');
var generate_uuid = require('../helpers/uuid.js');
var table = 'course';

exports.get_many = function (args) {
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
	var uuid = generate_uuid(true);
	req.body.uuid = uuid;
	req.body.instructor = 'parzycl1';
	console.log(req.body);
	db.none('insert into course (id, semester, year, subject, title, description, user_uid)' + 
		'values($(uuid), $(semester), $(year), $(subject), $(title), $(description), $(instructor) )', req.body)
	.then(function (data) {
		res.status(200).json({
			status: 'success',
			data: data,
			message: 'Created a new course'
		});
	})
	.catch(function (err) {
		console.log(err);
		return next(err);
	});

};

exports.update = function (req, res, next) {

};

exports.delete = function (req, res, next) {

};