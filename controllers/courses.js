var courses = require('../models/courses');
var videos  = require('../models/videos');
var token   = require('../helpers/token');



var get_some = function (req, res, next) {
	var args = req.query;
	args.inflection = 'many';
	courses.get(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some courses.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
};


var get_one = function (req, res, next) {
	courses.get({
		inflection: 'one',
		where: {id: req.params.id}
	}).then(function (data) {
		res.status(200).json({
			message: 'Retrieved one course.',
			data: data
		});
	}).catch (function (err) {
		console.log(err);
	});
};




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
	router.get('/api/courses', token.auth(), get_some);


	router.get('/api/courses/:id', token.auth(), get_one);


	router.get('/api/courses/:id/videos', token.auth(), get_videos);


	/*router.post('/api/courses', create);*/
};