var subjects      = require('./subjects');
var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var generate_uuid = require('../helpers/uuid');
var _             = require('lodash');
var async         = require('async');
var model_factory = require('../helpers/model-factory');
var table = 'topic';


exports.get = model_factory.retrieve({
	table: table,
	transforms: [
		function (topic) {
			return subjects.get({
				inflection: 'one',
				where: {id: topic.subject_id}
			}).then(function (subject) {
				topic.subject = subject;
				return topic;
			});
		}
	]
});