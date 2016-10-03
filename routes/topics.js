var topics             = require('../domain_objects/topics');
var authenticator      = require('../middleware/authenticator');
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {

  router.get('/api/topics', 
		authenticator.authenticate_token(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more topics',
			model: topics
		})
	);


	router.get('/api/topics/:id', 
		authenticator.authenticate_token(), 
		controller_factory.retrieve({
			inflection: 'one',
			message: 'Retrieved zero or one topics.',
			model: topics
		})
	);

};