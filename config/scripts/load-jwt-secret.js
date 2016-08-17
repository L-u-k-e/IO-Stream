var orm = require('../../helpers/orm');
var db = require('../db_config');

orm.select({
	db: db, 
	table: 'jwt_secret'
})
.then(function (secrets) {
	secret_key = secrets[0].key;
	process.env.jwt_secret_key = secret_key;
});