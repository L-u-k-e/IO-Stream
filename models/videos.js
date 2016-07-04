var courses = require('./courses')
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