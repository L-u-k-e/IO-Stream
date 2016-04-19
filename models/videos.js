var promise = require('bluebird');
var pg = require('pg-promise')({promiseLib: promise});
var connection_config = { 
	host: 'localhost',	
	port: '5432',
	user: 'www', 
	password: '123456', 
	database: 'io_stream' 
};
var db = pg(connection_config);


exports.get_all = function (req, res, next) {

};

exports.create = function (req, res, next) {
	db.none('insert into video (id, course_id, title, description, user_uid)' + 
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
	next();
};