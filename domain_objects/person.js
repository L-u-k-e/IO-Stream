var bluebird        = require('bluebird');
var bcrypt          = require('bcrypt');
var person_accessor = require('../data_accessors/person');


module.exports = {
	read:         person_accessor.read,
	create:       person_accessor.create,
	update:       person_accessor.update,
	replace:      person_accessor.replace,
	remove:       person_accessor.remove,
	authenticate: authenticate
	
};


function authenticate(args) {
	var user;
	return person_accessor.read({
		inflection: 'one',
		where: { id: args.user }
	})
	.then(function (result) {
		user = result;
		return bcrypt.compare(args.password, user.hash);
	})
	.then(function (same) {
		return { 
			valid: true, 
			user: person_accessor.sanitize(user) 
		};
	})
	.catch(function (err) {
		var auth_info = { valid: false };
		return auth_info;	
	});
}