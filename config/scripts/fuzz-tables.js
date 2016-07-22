/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 * 	
 *		This file will fill the tables with sample data. 
 *  	This is meant for development only. 
 *  
 *  	IF YOU RUN THIS IN PROD, YOU'RE GONNA HAVE A BAD TIME M'KAY?
 */


var faker         = require('faker');
var _             = require('lodash');
var db            = require('../db_config');
var generate_uuid = require('../../helpers/uuid');
var async         = require('async');
var fs            = require('fs-extra');
var path          = require('path');

var users = [];
var videos = [];
var courses = [];
var favorites = [];
var subscriptions = [];
var topics = [];
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









/*************************************** FUZZERS ***************************************/

var seed_users = function (next) {
	console.log('seeding users ...');

	_.times(15, function (i) {
		users.push({
			id:         faker.internet.userName(),
			faculty:    (i <= 5 || i > 10),
			super_user: (i <= 5),
			first_name: faker.name.firstName(),
			last_name:  faker.name.lastName()
		});
	});

	insert_items('person', users, next);
};





var seed_topics = function (next) {
	console.log('seeding topics...');

	var insert_topics = function (err, data) {
		_.times(50, function (i) {
			topics.push({
				id:          generate_uuid(true),
				subject_id:  _.sample(data[0]).id,
				title:       faker.commerce.productName(),
				description: faker.lorem[_.sample(['sentence', 'paragraph'])]
			});
		});
		insert_items('topic', topics, next);
	};

	async.series([
		_.curry(get_ids_from)('subject'),
	], insert_topics);
};





var seed_courses = function (next) {
	console.log('seeding courses...');

	var insert_courses = function (err, data) {
		_.times(250, function (i) {
			courses.push({
				id:          generate_uuid(true),
				topic_id:    _.sample(topics).id,
				semester_id: _.sample(data[0]).id,
				year:        faker.random.number({ min: 2000, max: new Date().getFullYear() }),
				section:     _.sample([null, 'A']),
				person_id:   _.sample(users).id
			});
		});
		insert_items('course', courses, next);
	};

	async.series([
		_.curry(get_ids_from)('semester')
	], insert_courses);
};





var seed_videos = function (next) {
	console.log('seeding videos...');

	var videos_path = path.join('public', 'videos');
	var publishing_dir = path.join(videos_path, 'published');
	var samples_dir = path.join(videos_path, 'samples');
	var video_samples_dir = path.join(samples_dir, 'videos');
	var thumbs_samples_dir = path.join(samples_dir, 'thumbnails');
	var video_names = fs.readdirSync(video_samples_dir);
	var thumb_names = fs.readdirSync(thumbs_samples_dir);
	
	_.each(fs.readdirSync(videos_path), function (item) {
		fs.removeSync(path.join(publishing_dir, item));
	});


	_.times(5000, function (i) {
		var uuid = generate_uuid(true);
		var video_file_src = path.join(video_samples_dir, _.sample(video_names));
		var thumb_file_src = path.join(thumbs_samples_dir, _.sample(thumb_names));
		var uuid_dir = path.join(publishing_dir, uuid);
		var video_file_dest = path.join(uuid_dir, uuid + path.extname(video_file_src));
		var thumb_file_dest = path.join(uuid_dir, 'thumb' + path.extname(thumb_file_src));
		fs.mkdirSync(uuid_dir);
		fs.symlinkSync(path.resolve(video_file_src), video_file_dest);
		fs.symlinkSync(path.resolve(thumb_file_src), thumb_file_dest);
		videos.push({
			id:            uuid,
			duration:      (Math.random()*1000+1).toFixed(2),
			date_uploaded: faker.date.past(),
			course_id:     _.sample(courses).id,
			title:         faker.company.catchPhrase(),
			description:   faker.lorem[_.sample(['sentence', 'paragraph'])],
			thumbnail_src: thumb_file_dest.replace('public',''),
			src:           video_file_dest.replace('public','')
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
	seed_topics,
	seed_courses,
	seed_videos,
	seed_favorites,
	seed_subscriptions,
]);
