/*
 * Author: Lucas Parzych
 * Email:  parzycl1@sunyit.edu
 * 
 * Description:
 * 	This application accepts JSON objects embedded in query strings. 
 * 	This middleware parses the embedded objects, mutating the original 
 * 	req.query object.
 */

var _ = require('lodash');

var try_to_parse = function (str) {
	var result;
	try { result = JSON.parse(str); }
	catch (parse_error) { result = str; }
	return result;
};

module.exports = function (req, res, next) {
	req.query = _.mapValues(req.query, try_to_parse);
	next();
};