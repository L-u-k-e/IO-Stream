var promise = require('bluebird');
var pg = require('pg-promise')({promiseLib: promise});
var connection_config = { 
	host: 'localhost',	
	port: '5432',
	user: 'www', 
	password: '123456', 
	database: 'io_stream' 
};
var db = pg(connection_config);


exports.get_all = function (req, res, next) {

};

exports.create = function (req, res, next) {
	console.log(req.query);
};