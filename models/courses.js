var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var semesters     = require('./semesters');
var people        = require('./people');
var topics        = require('./topics');
var _             = require('lodash');
var model_factory = require('../helpers/model-factory');

var table     = 'course';

exports.get = model_factory.retrieve({
	table: table,
	transforms: [
		//topic details
		function (course) {
			return topics.get({
				inflection: 'one',
				where: {id: course.topic_id}
			}).then(function (topic) {
				course.topic = topic;
				return course;
			});
		},
		//person details
		function (course) {
			return people.get({
				inflection: 'one',
				where: {id: course.person_id}
			}).then(function (person) {
				course.person = person;
				return course;
			});
		},
		//semester details
		function (course) {
			return semesters.get({
				inflection: 'one',
				where: {id: course.semester_id}
			}).then(function (semester) {
				course.semester = semester;
				return course;
			});
		}
	] 
});