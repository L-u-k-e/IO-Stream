var uuid_generator = require('node-uuid');
var b64_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var b64 = require('base-x')(b64_alphabet);

/* Generate an encoded UUID */
module.exports = function (should_encode) {
 	// Only using 64 bits here to keep the encoding down to 11 characters. 
 	var buffer = new Buffer(8);
 	var uuid = uuid_generator.v4(null, buffer);
 	if (should_encode) { uuid = b64.encode(uuid); }
 	return uuid;
}