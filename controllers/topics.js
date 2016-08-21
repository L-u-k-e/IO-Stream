var topics             = require('../models/topics');
var token              = require('../helpers/token'); 
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {

  router.get('/api/topics', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more topics',
			model: topics
		})
	);


	router.get('/api/topics/:id', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'one',
			message: 'Retrieved zero or one topics.',
			model: topics
		})
	);

};