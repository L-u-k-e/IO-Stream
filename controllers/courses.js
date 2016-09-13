var courses            = require('../models/courses');
var videos             = require('../models/videos');
var token              = require('../helpers/token');
var controller_factory = require('../helpers/controller-factory');


/*
controller_factory.generate({
	type: 'retrieve many',
	message: 'Retrieved some courses.',
	model: courses,
	before_query: function (args, req, res, next) {},
	after_query: function (args, req, res, next) {}
});
*/


var get_videos = function (req, res, next) {
	var args = {}; 
	args.where = {items: {course_id: req.params.id}, delimiter: 'AND'};
	videos.get_some(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some videos for course: ' + req.params.id,
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});;
};




var confirm_reorder_action = function (req, res, next) {
	if (req.query.action == 'reorder') next();
	else next('route');
}



var reorder_course_videos = function (req, res, next) {
	videos.reorder({
		course_id: req.params.id,
		video_id: req.body.video_id,
		new_rank: req.body.new_rank
	}).then(function (result) {
		res.status(200).json({
			message: 'Re-ranked video' + req.body.video_id + ' to ' + req.body.new_rank,
			data: {}
		});
	});
}



module.exports = function (router) {

	router.get('/api/courses', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'many',
			message: 'Retrieved zero or more courses',
			model: courses
		})
	);


	router.get('/api/courses/:id', 
		token.auth(), 
		controller_factory.retrieve({
			inflection: 'one',
			message: 'Retrieved zero or one courses.',
			model: courses
		})
	);


	router.patch('/api/courses/:id/videos', 
		token.auth(),
		confirm_reorder_action,
		reorder_course_videos
	);


	/*router.post('/api/courses', create);*/
};