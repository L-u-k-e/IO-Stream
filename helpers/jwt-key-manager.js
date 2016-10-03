/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 *
 *   Manage the JWT secret keys
 *
 */

var b64_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var b64 = require('base-x')(b64_alphabet);
var db = require('../config/db_config');
var orm = require('./orm');
var crypto = require('crypto');


var current_key;
module.exports = {
	initialize_new_key: initialize_new_key,
	load_key: load_key,
	get_key: get_key
};



if (process.argv[2] === 'init') initialize_new_key(); 
function initialize_new_key() {
	// code should run here that deletes the existing jwt keys.
	// ...

	var secret = b64.encode(crypto.randomBytes(256));
	orm.insert({
		db: db,
		table: 'jwt_secret',
		values: {key: secret}
	});
}



function load_key() {
	return orm.select({
		db: db, 
		table: 'jwt_secret'
	})
	.then(function (secrets) {
		current_key = secrets[0].key;
	});
}



function get_key() {
	return current_key;
}



