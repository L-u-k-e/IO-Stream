/*
 * Author: Lucas Parzych
 * Email:  parzycl1@sunyit.edu
 * 
 * Description:
 *	This function will generate a 64bit uuid (v4) 
 *	and will optionally base64 encode it.
 *
 */

var uuid_generator = require('node-uuid');
var b64_alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
var b64 = require('base-x')(b64_alphabet);

module.exports = function (should_encode) {
	// Only using 8 bytes here to keep the encoding down to 11 characters. 
	var buffer = new Buffer(8);
	var uuid = uuid_generator.v4(null, buffer);
	if (should_encode) { uuid = b64.encode(uuid); }
	return uuid;
}