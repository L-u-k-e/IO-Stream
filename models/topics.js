var subjects      = require('./subjects');
var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var generate_uuid = require('../helpers/uuid');
var _             = require('lodash');
var async         = require('async');
var table = 'topic';


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

	//subject details
	promise = promise.map(function (topic) {
		return subjects.get({
			inflection: 'one',
			where: {id: topic.subject_id}
		}).then(function (subject) {
			topic.subject = subject;
			return topic;
		});
	});

	if (args.inflection === 'one') {
		promise = promise.then(function (topics) {
			if (_.isEmpty(topics)) return {};
			else return topics[0];
		});
	}

	return promise;
};