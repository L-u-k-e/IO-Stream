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
var db = require('../config/db_config.js');
var generate_uuid = require('../helpers/uuid.js');
var async = require('async');



var users = [];
var videos = [];
var courses = [];
var favorites = [];
var subscriptions = [];
var uploads_in_prog = [];


/* 
	5 faculty,
	5 non-faculty,
	5 faculty/super_users
*/
var create_users = function (next) {
  console.log('seeding users ...');
	_.times(15, function (i) {
		users.push({
			id: faker.internet.userName(),
			faculty: (i <= 5 || i > 10),
			super_user: (i <= 5)
		});
	});

	var iter = function () {
		if (_.isEmpty(users)) next(null); 
		else insert_users();
	}; 
	
	var insert_users = function () {
		var user = users.pop();
		db.none('insert into person (id, faculty, super_user)' + 
		  			'values($(id), $(faculty), $(super_user) )', user )
		.then(function (data) { iter(); })
		.catch(function (err) {
			console.log(err);	
			iter();
		});
	};

	insert_users();
};





var subjects = [

];








async.series([
	create_users,
]);



