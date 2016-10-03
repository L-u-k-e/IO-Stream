var courses             = require('../domain_objects/course');
var videos              = require('../domain_objects/video');
var authenticator       = require('../middleware/authenticator');
var controller_factory  = require('../helpers/controller-factory');
//var request_mods        = require('../helpers/request-mods');


var course_controller = controller_factory.new(courses);
var video_controller  = controller_factory.new(videos);

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

	/*-------------- Course Collection --------------*/

	/* Get a course collection */
	router.get('/api/courses', 
		authenticator.authenticate_token(), 
		course_controller.read({
			inflection: 'many',
			message: 'Retrieved zero or more courses'
		})
	);


	/* Create a new course */
	router.post('/api/courses',
		authenticator.authenticate_token(),
		course_controller.create({
			message: 'Created a new course'
		})
	);



	/*-------------- Course --------------*/

	/* Get a course */
	router.get('/api/courses/:id', 
		authenticator.authenticate_token(), 
		course_controller.read({
			inflection: 'one',
			message: 'Retrieved zero or one courses.'
		})
	);


	/* Replace an existing course */
	router.put('/api/courses/:id',
		authenticator.authenticate_token(),
		course_controller.replace({
			message: 'Replaced an existing course'
		})
	);


	/* Modify an existing course */
	router.patch('/api/courses/:id',
		authenticator.authenticate_token(),
		course_controller.update({
			message: 'Modified an existing course'
		})
	);


	/* Delete an existing course */
	router.delete('/api/courses/:id',
		authenticator.authenticate_token(),
		course_controller.remove({
			message: 'Deleted an existing course'
		})
	);



	/*-------------- Course Videos --------------*/

	/* Get all of the videos in a course */
	router.get('/api/courses/:id/videos',
		authenticator.authenticate_token(),
		//request_mods.param_to_query({param: 'id', query: 'where.course_id'}),
		video_controller.read({
			message: 'Retrieved zero or more videos',
			model: videos
		})
	);


	/* Re-rank a video in a course */
	router.patch('/api/courses/:id/videos', 
		authenticator.authenticate_token(),
		confirm_reorder_action,
		reorder_course_videos
	);


};