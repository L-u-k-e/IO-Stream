/*
 * Author: Lucas Parzych
 * Email:  parzycl1@sunyit.edu
 * 
 * Description:
 *  As the file name implies, this module exposes a set of helper functions 
 *  which provide object-relational mapping to make it easier for models to  
 *  access the database.
 *
 */

var _   = require('lodash');
var pgp = require('pg-promise');







/* Generate formatted and escaped sequences of foo=bar [delim] ... */
var equals = function (args) {
	if (!args) { return ''; }
	var delimiter = (args.delimiter || 'AND');
	var items = (args.items || args);
	var self = {};
	self._rawDBType = true;
	self.formatDBType = function () {
		var props = Object.keys(items);
		var s = props.map(function (k) {
			return k + '=$(' + k + ')';
		});
		return pgp.as.format(s.join(' ' + delimiter + ' '), items);
	}
	return self;
};



var list = function (items) {
	if (!items) return ''; 
	return items.map(pgp.as.name).join();
};



var insert = function (args) {
	var keys = _.keys(args.values);
	var query = pgp.as.format('INSERT INTO $1~($2^) VALUES($3^) RETURNING *', [
		args.table,
		list(keys),
		keys.map(function (k) { return '$(' + k + ')'; }).join(', ')
	]);
	return args.db.one(query, args.values);
}



var select = function (args) {
	var template_string = 'SELECT $1^ FROM $2~';
	var template_vars = [(list(args.columns) || '*'), args.table];
	var i=3;
	
	var optional_clauses = [
		['where',  'WHERE ($i)',   function () { return equals(args.where); }],
		['order',  'ORDER BY $i^', function () { return list(args.order); }],
		['limit',  'LIMIT $i',     function () { return args.limit; }],
		['offset', 'OFFSET $i',    function () { return args.offset; }]
	];
	_.each(optional_clauses, function (clause) {
		if (_.has(args, clause[0]) && args[clause[0]] != null) {
			template_string += ' ' + clause[1].replace('$i', '$'+i);
			template_vars.push(clause[2]());
			i += 1;
		}
	});

	var query = pgp.as.format(template_string, template_vars);
	return args.db[(args.qrm || 'any')](query);
};



var update = function (args) {
	var query = pgp.as.format('UPDATE $1~ SET $2^ WHERE ($3) RETURNING *', [
		args.table,
		equals({items:args.set, delimiter: ','}),
		equals({items:args.where, delimiter: 'AND'})
	]);
	return args.db.one(query);
};



var remove = function (args) {
	var query = pgp.as.format('DELETE FROM $1~ WHERE ($2)', [
		args.table,
		equals(args.where)
	]);
	return args.db.result(query);
};



module.exports = {
	equals:    equals,
	list:      list,
	insert:    insert,
	select:    select,
	update:    update,
	remove:    remove
};


