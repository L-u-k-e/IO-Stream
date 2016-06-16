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
  var self = {};
  self.formatDBType = function () {
    var props = Object.keys(args.items);
    var s = props.map(function (k) {
        return k + '=$(' + k + ')';
    });

    return pgp.as.format(s.join(' ' + args.delimiter + ' '), args.items);
  }
  return self;
};



var list = function (items) {
  if (!items) { return ''; }
  console.log(items);
  var names = items.map(function (c) { return pgp.as.name(c); }).join(', ');
  console.log(names);
  return names;
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
  var query = pgp.as.format('SELECT $1^ FROM $2~ WHERE ($3^) ORDER BY $4^ LIMIT $5 OFFSET $6', [
    list(args.columns) || '*',
    args.table,
    equals({items: args.where || {true:true}, delimiter: 'AND'}),
    list(args.order),
    args.limit || 'ALL',
    args.offset || 0
  ]);
  console.log(query);
  return args.db[args.qrm || 'any'](query);
};



/*Generate an update query provided a table name, a values object and a set of mutually dependent conditions. */
var update = function (args) {
  var query = pgp.as.format('UPDATE $1~ SET $2^ WHERE ($3^) RETURNING *', [
    args.table,
    equals({items:args.set, delimiter: ','}),
    equals({items:args.where, delimiter: 'AND'})
  ]);
  return args.db.one(query);
};




module.exports = {
  select:    select,
  insert:    insert,
  update:    update,
  equals:    equals,
  list:      list
};


