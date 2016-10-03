var semesters          = require('../domain_objects/semesters');
var authenticator      = require('../middleware/authenticator');
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {

	router.get('/api/semesters', 
		authenticator.authenticate_token(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more semesters',
			model: semesters
		})
	);

};