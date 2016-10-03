var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var generate_uuid = require('../helpers/uuid')
var _             = require('lodash');
var Promise       = require('bluebird');

/*
 *  self: configuration information specific to a model
 *    table:                The db table it represents
 *    properties:           All of the column names in the table
 *    required_properties:  The columns that are required for an insert
 *    public_properties:    Columns that are okay to show the user
 *    auto_uudd:            The column name of a UUID column if it should be auto generated
 *    relationships:        A list of objects describing the relationships that this table has to others.
 *                          This list is used to expand FK's on reads if requested.
 *                          Objects must have the following properties: {
 *	                           local_key:     the name of the column that is the FK in this table
 *                             foreign_key:   the name of the 'ID' column that contains the value to match 
 *                                            to our local key
 *                             data_accessor: a reference to the data accessor that can be used to read 
 *                                            the foreign row. 
 *                          }
 */
module.exports = {
	new: function (self) {
		return {
			read:      _.partial(read,      self),
			create:    _.partial(create,    self),
			replace:  _.partial(replace,  self),
			update:    _.partial(update,    self),
			remove:    _.partial(remove,    self),
			sanitize:  _.partial(sanitize,  self)
		};
	}
}



function read(self, params) {
		params = params || {};
		var promise = orm.select({
			db:      db, 
			table:   self.table,
			where:   params.where,
			order:   params.order,
			limit:   params.limit,
			offset:  params.offset,
			group:   params.group
		});	

		var expansions = _.intersection((params.expansions || []), _.keys(self.relationships));
		_.each(expansions, function (name) {
			var relationship = self.relationships[name];
			var foreign_domain_object = relationship.accessor;
			promise = promise.map(function (local_row) {
				var where = {};
				where[relationship.foreign_key] = local_row[relationship.local_key];
				return foreign_domain_object.read({
					inflection: 'one',
					public: true,
					where: where
				}).then(function (foreign_row) {
					local_row[name] = foreign_row;
					return local_row;
				});
			});
		});

		if (params.public) {
			promise = promise.map(function (row) {
				return Promise.resolve(_.pick(row, self.public_properties));
			});
		}

		if (params.inflection === 'one') {
			promise = promise.then(function (data) {
				if (_.isEmpty(data)) return {};
				else return data[0];
			});
		}
		
		return promise;
}




function create(self, params) {
	params = params || {};
	if (self.auto_uuid) params[self.auto_uuid] = generate_uuid(true);
	var promise = orm.insert({
		db: db,
		table: self.table,
		values: params
	});
	return promise;
}



function replace(self, params) {
	if (!_.isEmpty(_.difference(self.required_properties, _.keys(params.values)))) {
		var error = new Error("Missing required properties");
		error.name = 'missing properties';
		return Promise.reject(error);
	}
	
	//We don't want to actually delete the row because of FK constraints.
	//If a (non-required) property isn't provided, we need to explicitly re-initialize it to null
	var default_nulls = _.fromPairs(_.map(self.properties, function (p) { return [p, null]})); 
	params.values = _.defaults(params.values, default_nulls);

	return update(self, params);
}



function update(self, params) {
	params = params || {};
	var promise = orm.update({
		db: db,
		table: self.table,
		set: params.values,
		where: {id: params.id}
	});
	return promise;
}



function remove(self, params) {
	params = params || {};
	return orm.remove({
		db: db,
		table: self.table,
		where: {id: params.id}
	});
}


function sanitize(self, objects) {
	objects_arr = _.isArray(objects) ? objects : [objects];
	objects_arr = objects_arr.map(_.partialRight(_.pick, self.public_properties));
	return _.isArray(objects) ? objects_arr : objects_arr[0];
}


