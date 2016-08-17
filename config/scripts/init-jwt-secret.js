/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 *
 *   Generate a new secret key for signing tokens and store it in the database. 
 *
 */
var b64_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var b64 = require('base-x')(b64_alphabet);
var orm = require('../../helpers/orm');
var db = require('../db_config');
var crypto = require('crypto');

var secret = b64.encode(crypto.randomBytes(256));
orm.insert({
	db: db,
	table: 'jwt_secret',
	values: {key: secret}
});
