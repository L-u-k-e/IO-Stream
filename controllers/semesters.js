var semesters = require('../models/semesters');
var token     = require('../helpers/token');

module.exports = function (router) {
	router.get('/api/semesters', token.auth(), get_some);
}



function get_some(req, res, next) {
	var args = req.query;
	args.inflection = 'many';
	semesters.get(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some semesters.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
}