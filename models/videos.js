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

exports.create_new_video = function (req, res, next) {
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
	next();
};