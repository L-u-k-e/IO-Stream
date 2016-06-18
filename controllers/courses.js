var courses = require('../models/courses.js');

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
	console.log(req.query);
	courses.get_many(req.query)
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

module.exports = function (router) {
	router.get('/api/courses', get_some);
	/*router.get('/api/courses/:id', get_one)
	router.post('/api/courses', create);
	*/
};