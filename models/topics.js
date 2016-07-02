var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var generate_uuid = require('../helpers/uuid');
var _             = require('lodash');
var async         = require('async');

var table = 'topic';

exports.get_some = function (args) {
	var topics_promise = orm.select({
		db:     db, 
		table:  table,  
		where:  args.where,
		order:  args.order,
		limit:  args.limit,
		offset: args.offset,
		group:  args.group
	});

	var topics_with_subjects_promise = topics_promise.map(function (topic) {
		var promise = orm.select({
			db: db,
			table: 'subject',
			qrm: 'one',
			where: {id: topic.subject_id}
		}).then(function (subject) {
			topic.subject = subject.title;
			return topic;
		});
		return promise;
	});

	return topics_with_subjects_promise;
};

exports.get_one = function (args) {
	var topic_promise = orm.select({
		db: db,
		table: table,
		where: {id: args.id},
		qrm: 'one'
	}).then(function(topic) {
		var promise = orm.select({
			db: db,
			table: 'subject',
			where: { id: topic.subject_id },
			qrm: 'one'
		}).then(function (subject) {
			topic.subject = subject.title;
			return topic;
		});
		return promise;
	});
	return topic_promise;
};