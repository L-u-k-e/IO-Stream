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

module.exports = function (router) {

	/**
	 * @swagger
	 * definition:
	 *   Course:
	 *     properties:
	 *       id:
	 *         type: string
	 *       topic_id:
	 *         type: string
	 *       semester_id:
	 *         type: integer
	 *       year:
	 *         type: string
	 *       section:
	 *         type: string
	 *       person_id:
	 *         type: string
	 */







	/**
	 * @swagger	
   * /api/courses:
   *   get:
   *     tags:
   *       - Courses
   *     description: Returns a set of courses
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: An array of courses
   *         schema:
   *           $ref: '#/definitions/Course'
   *     parameters:
   *       - name: where
   *         description: JSON object whose keys are model attributes and values are the filter values. 
   *           There is an implied AND between the individual keys/value pairs.
   *         type: string
   *         required: false
   *         in: query
   */
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


	router.get('/api/courses/:id/videos', token.auth(), get_videos);


	/*router.post('/api/courses', create);*/
};