var subjects           = require('../domain_objects/subjects');
var authenticator      = require('../middleware/authenticator');
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {
	router.get('/api/subjects', 
		authenticator.authenticate_token(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more subjects',
			model: subjects
		})
	);
};