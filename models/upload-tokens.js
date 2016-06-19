var db = require('../config/db_config.js');
var orm = require('../helpers/orm.js');
var videos = require('./videos.js'); 
var generate_uuid = require('../helpers/uuid.js');




exports.get = function (spec) {
	var promise = orm.select({
		db: db, 
		table: 'upload_token',
		qrm: 'one',
		columns: ['video_id', 'file_id'],
		where: {
			items: spec,
			delimiter: 'AND'
		}
	});
	return promise;
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
};



exports.delete = function (spec) {
	var promise = orm.remove({
		db: db,
		table: 'upload_token',
		where: {items: {video_id: spec.video_id, file_id: spec.file_id}, delimiter: 'AND'}
	});
	return promise;
};
