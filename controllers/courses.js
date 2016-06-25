var courses = require('../models/courses');
var videos  = require('../models/videos');
/* general flow: authenticate -> controller -> send response */
/*(var route_map = [
	{ verb:  'get', 
		route: '/api/courses',
		privs: ['read'],
		model_method: 'get_all'
	}, {
		verb:  'get', 
		route: '/api/courses/:id',
		privs: ['read'],
		model_method: 'get'
	}
];

model.exports = function (router) {
	_.each(map, function (spec) {
		router[spec.verb](route, _.partial(check_privs, privs), courses[model_method]);
	});
};*/

var get_some = function (req, res, next) {
	courses.get_some(req.query)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some courses.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
};


var get_one = function (req, res, next) {
	courses.get_one({id: req.params.id})
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved one course.',
			data: data
		});
	}).catch (function (err) {
		console.log(err);
	});
};




var get_videos = function (req, res, next) {
	var args = {}; 
	args.where = {items: {course_id: req.params.id}, delimiter: 'AND'};
	videos.get_some(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some videos for course: ' + req.params.id,
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});;
};

module.exports = function (router) {
	router.get('/api/courses', get_some);
	router.get('/api/courses/:id', get_one);
	router.get('/api/courses/:id/videos', get_videos);
	/*router.post('/api/courses', create);*/
};