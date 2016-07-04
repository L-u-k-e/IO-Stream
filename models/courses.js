var db        = require('../config/db_config');
var orm       = require('../helpers/orm');
var semesters = require('./semesters');
var people    = require('./people');
var topics    = require('./topics');
var _         = require('lodash');
var table     = 'course';


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

	//topic details
	promise = promise.map(function (course) {
		return topics.get({
			inflection: 'one',
			where: {id: course.topic_id}
		}).then(function (topic) {
			course.topic = topic;
			return course;
		});
	});

	//professor details
	promise = promise.map(function (course) {
		return people.get({
			inflection: 'one',
			where: {id: course.person_id}
		}).then(function (person) {
			course.person = person;
			return course;
		});
	});

	//semester details
	promise = promise.map(function (course) {
		return semesters.get({
			inflection: 'one',
			where: {id: course.semester_id}
		}).then(function (semester) {
			course.semester = semester;
			return course;
		});
	});

	if (args.inflection === 'one') {
		promise = promise.then(function (courses) {
			if (_.isEmpty(courses)) return {};
			else return courses[0];
		});
	}

	return promise;
};