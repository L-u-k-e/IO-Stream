var db = require('../config/db_config.js');
var orm = require('../helpers/orm.js');
var videos = require('./videos.js'); 
var generate_uuid = require('../helpers/uuid.js');




exports.lookup = function (spec) {
	var params = {
		db: db, 
		table: 'upload_token',
		columns: ['video_id'],
		where: {
			items: spec,
			delimiter: 'AND'
		}
	};
	var query = orm.select(params);
	return query
};





exports.create = function (spec) {

	var video_id  = generate_uuid(true); 
	var file_id   = spec.file_id;
	var course_id = 'Ck6yvy9SE2I';
	var promise = videos.create({id: video_id, course_id: course_id })
	.then(function (video) {
		return orm.insert({
			db:     db, 
			table:  'upload_token',
			values: { video_id: video_id, file_id: file_id }
		});
	});
  return promise;


	/*
	.then(function () {
		req.found_file = true;
		req.new_token = true;
		req.video_id = video_id;
		next();
	})
	.catch(function (err) {
		console.log(err);
		next(err);
	});
	*/

};