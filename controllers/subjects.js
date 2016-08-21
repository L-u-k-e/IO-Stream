var subjects           = require('../models/subjects');
var token              = require('../helpers/token');
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {
	router.get('/api/subjects', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more subjects',
			model: subjects
		})
	);
};