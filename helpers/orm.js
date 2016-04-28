var _   = require('lodash');
var pgp = require('pg-promise');







/* Generate formatted and escaped sequences of foo=bar [delim] ... */
var equals = function (spec) {
  var self = {};
  self.formatDBType = function () {
    var props = Object.keys(spec.items);
    var s = props.map(function (k) {
        return k + '=$(' + k + ')';
    });
    return pgp.as.format(s.join(' ' + spec.delimiter + ' '), spec.items);
  }
  return self;
};



var list = function (items) {
 var names = items.map(function (c) { return pgp.as.name(c); }).join(', ');
 return names;
};



var insert = function (spec) {
  var keys = _.keys(spec.values);
  var query = pgp.as.format('INSERT INTO $1~($2^) VALUES($3^) RETURNING *', [
    spec.table,
    list(keys),
    keys.map(function (k) { return '$(' + k + ')'; }).join(', ')
  ]);
  return spec.db.one(query, spec.values);
}


var select = function (spec) {
  var query = pgp.as.format('SELECT $1^ FROM $2~ WHERE ($3^)', [
    list(spec.columns),
    spec.table,
    equals(spec.where),
  ]);
  return spec.db[spec.qrm || 'any'](query);
};



/*Generate an update query provided a table name, a values object and a set of mutually dependent conditions. */
var update = function (db, table, set, where) {
  var query = pgp.as.format('UPDATE $1~ SET $2^ WHERE ($3^)', [
    table,
    set_values(set, ','),
    set_values(where, 'AND')
  ]);
  return db.none(query);
};




module.exports = {
  select:    select,
  insert:    insert,
  update:    update,
  equals:    equals,
  list:      list
};


