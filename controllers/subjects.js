var subjects = require('../models/subjects');
var token     = require('../helpers/token');

module.exports = function (router) {
	router.get('/api/subjects', token.auth(), get_some);
}



function get_some(req, res, next) {
	var args = req.query;
	args.inflection = 'many';
	subjects.get(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some subjects.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
}