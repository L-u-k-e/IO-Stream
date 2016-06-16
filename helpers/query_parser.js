/*
 * This application accepts JSON objects embedded in query strings. 
 * This middleware parses the embedded objects, mutating the original 
 * req.query object.
 */

var _ = require('lodash');

module.exports = function (req, res, next) {
	req.query = _.mapValues(req.query, JSON.parse);
	next();
};