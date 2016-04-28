var _   = require('lodash');
var pgp = require('pg-promise');
var db = require('../config/db_config.js')


/*
 *	Generate an insert query provided a table name and an object. 
 */
exports.insert = function (table, values) {
	var keys = _.keys(values);
	var query = pgp.as.format('INSERT INTO $1~($2^) VALUES($3^)', [
    table,
    keys.map(function (k) { return pgp.as.name(k); }).join(', '),
    keys.map(function (k) { return '$(' + k + ')'; }).join(', ')
  ]);
  return query;
};






/*
 * Generate formatted and escaped sequences of SET foo=bar [delim] ...
 */
var set_values = function (obj, delim) {
  var self = {};
	self.obj = obj;
	self.formatDBType = function () {
    var props = Object.keys(this.obj);
    var s = props.map(function (k) {
        return k + '=$(' + k + ')';
    });
    return pgp.as.format(s.join(' ' + delim + ' '), self.obj);
  }
  return self;
};

/*
 *  Generate an update query provided a table name, a values object and a set of mutually dependent conditions. 
 */
exports.update = function (table, set, where) {
  var query = pgp.as.format('UPDATE $1~ SET $2^ WHERE ($3^)', [
    table,
    set_values(set, ','),
    set_values(where, 'AND')
  ]);
  return query;
};




