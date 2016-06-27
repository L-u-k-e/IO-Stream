var promise = require('bluebird');
var pg = require('pg-promise')({promiseLib: promise});
var connection_config = { 
	host: 'localhost',
	user: 'www',
	password: '1234567',
	database: 'io_stream'
};
var db = pg(connection_config);

module.exports = db;