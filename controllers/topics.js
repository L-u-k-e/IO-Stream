var topics = require('../models/topics');
var token  = require('../helpers/token'); 



var get_some = function (req, res, next) {
	var args = req.query;
	args.inflection = 'many';
	topics.get(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some topics.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
};


var get_one = function (req, res, next) {
	topics.get({
		inflection: 'one',
		where: {id: req.params.id}
	}).then(function (data) {
		res.status(200).json({
			message: 'Retrieved one topic.',
			data: data
		});
	}).catch (function (err) {
		console.log(err);
	});
};






module.exports = function (router) {
	router.get('/api/topics', token.auth(), get_some);
	router.get('/api/topics/:id', token.auth(), get_one);
};