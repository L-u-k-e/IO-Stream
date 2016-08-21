var semesters          = require('../models/semesters');
var token              = require('../helpers/token');
var controller_factory = require('../helpers/controller-factory');


module.exports = function (router) {

	router.get('/api/semesters', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more semesters',
			model: semesters
		})
	);

};