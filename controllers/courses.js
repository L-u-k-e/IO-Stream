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



module.exports = function (router) {
	router.get('/api/courses', courses.get_all);
	router.get('/api/courses/:id', courses.get)
	router.post('/api/courses', courses.create);
};