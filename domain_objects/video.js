var courses = require('./course');
var Promise = require('bluebird');
var db      = require('../config/db_config');
var orm     = require('../helpers/orm');
var _       = require('lodash');
var table   = 'video';






exports.get = function (args) {
	args = args || {};

	var promise = orm.select({
		db:     db, 
		table:  table, 
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});
	
	//course details	
	promise = promise.map(function (video) {
		return courses.get({
			inflection: 'one',
			where: {id: video.course_id}
		}).then(function (course) {
			video.course = course;
			return video;
		});
	});

	if (args.inflection === 'one') {
		promise = promise.then(function (videos) {
			if (_.isEmpty(videos)) return {};
			else return videos[0];
		});
	}

	return promise;
};


exports.get_all = function (req, res, next) {

};



exports.get_some = function (args) {
	var promise = orm.select({
		db:     db, 
		table:  table,  
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});
	return promise;	
}



exports.update = function (args) {
	var promise = orm.update({
		db:    db, 
		table: 'video', 
		set:   args.set, 
		where: args.where
	});
	return promise;
}


exports.create = function (values) {
	var promise = orm.insert( {
		db:    db, 
		table: 'video',
		values: values
	});
	return promise;
};



exports.reorder = function (params) {
	var new_rank = params.new_rank;
	var video_to_move_id = params.video_id;
	var get_videos = orm.select({
		db: db,
		table: table,
		where: {course_id: params.course_id},
		order: [{column: 'rank', order: 'desc'}]
	});

	var promise = get_videos.then(function (videos) {
		return db.tx(function (t) {
			var video_to_move = _.find(videos, {id: video_to_move_id});
			var old_rank = video_to_move.rank;
			var start_index = videos.length - Math.max(old_rank, new_rank);
			var end_index = start_index + Math.abs(new_rank - old_rank);
			var sql_op = (new_rank > old_rank) ? '-' : '+';
			var updates = [];

			for (var i = start_index; i <= end_index; i++) {
				updates.push(
					this.none('UPDATE $1^ SET rank = rank $2^ 1 WHERE id=$3', [table, sql_op, videos[i].id])
				);
			}

			updates.push(
				this.none('UPDATE $1^ SET rank = $2 WHERE id=$3', [table, new_rank, video_to_move_id])
			);

			return updates;
		});
	});

	return promise;
}