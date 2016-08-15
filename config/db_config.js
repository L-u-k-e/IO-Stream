var promise = require('bluebird');
var pg = require('pg-promise')({promiseLib: promise});
var connection_config = { 
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME
};
var db = pg(connection_config);

module.exports = db;