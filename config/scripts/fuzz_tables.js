/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 * 	
 *		This file will fill the tables with sample data. 
 *  	This is meant for development only. 
 *  
 *  	IF YOU RUN THIS IN PROD, YOU'RE GONNA HAVE A BAD TIME M'KAY?
 */


var faker = require('faker');
var _ = require('lodash');
var db = require('../db_config.js');
var generate_uuid = require('../../helpers/uuid.js');
var async = require('async');



var users = [];
var videos = [];
var courses = [];
var favorites = [];
var subscriptions = [];
var uploads_in_prog = [];




/*************************************** HELPERS ***************************************/

var create_insert_statement = function (table_name, obj) {
	var keys = _.keys(obj);
	var string = 'insert into ' + table_name + ' ' + 
		'(' + keys.join(', ') + ') ' +
		'values (' + _.map(keys, function(s) { return '$('+s+')'}).join(', ') + ')';
	return string;	
};


var insert_items = function (table_name, items, done) {
	var items = _.clone(items);
	var iter = function () {
		if (_.isEmpty(items)) done(null); 
		else insert_next_item();
	};
	var insert_next_item = function () {
		var item = items.pop();
		db.none(create_insert_statement(table_name, item), item)
		.then(function (data) { iter(); })
		.catch(function (err) {
			console.log(err);
			iter();
		});
	}
	insert_next_item();
};



var get_ids_from = function (table, cb) {
	db.many('select id from ' + table)
	.then(function (data) {
		cb(null, data);
	});
};









/*************************************** SEEDERS ***************************************/

var seed_users = function (next) {
  console.log('seeding users ...');

	_.times(15, function (i) {
		users.push({
			id:         faker.internet.userName(),
			faculty:    (i <= 5 || i > 10),
			super_user: (i <= 5)
		});
	});

	insert_items('person', users, next);
};





var seed_courses = function (next) {
	console.log('seeding courses...');

	var insert_courses = function (err, data) {
		_.times(25, function (i) {
			courses.push({
				id:          generate_uuid(true),
				person_id:   _.sample(users).id,
				year:        faker.random.number({ min: 2000, max: new Date().getFullYear() }),
				subject_id:  _.sample(data[0]).id,
				semester_id: _.sample(data[1]).id,
				title:       faker.commerce.productName(),
				description: faker.lorem[_.sample(['sentence', 'paragraph'])]
			});
		});
		insert_items('course', courses, next);
	};

	async.series([
		_.curry(get_ids_from)('subject'),
		_.curry(get_ids_from)('semester')
	], insert_courses);
};





var seed_videos = function (next) {
	console.log('seeding courses...');

	_.times(50, function (i) {
		videos.push({
			id:          generate_uuid(true),
			duration:   (Math.random()*1000+1).toFixed(2), 
			course_id:   _.sample(courses).id,
			title:       faker.company.catchPhrase(),
			description: faker.lorem[_.sample(['sentence', 'paragraph'])]
		});
	});

	insert_items('video', videos, next);

};





var seed_favorites = function (next) {
  console.log('seeding favorites...');

	_.times(100, function (i) {
		favorites.push({
			video_id:   _.sample(videos).id,
			person_id:  _.sample(users).id
		});
	});

	insert_items('favorite', favorites, next);

};





var seed_subscriptions = function (next) {
  console.log('seeding subscriptions...');

	_.times(100, function (i) {
		subscriptions.push({
			course_id:  _.sample(courses).id,
			person_id:  _.sample(users).id
		});
	});

	insert_items('subscription', subscriptions, next);

};





async.series([
	seed_users,
	seed_courses,
	seed_videos,
	seed_favorites,
	seed_subscriptions,
]);
