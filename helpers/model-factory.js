var db        = require('../config/db_config');
var orm       = require('../helpers/orm');
var _         = require('lodash');
var Promise   = require('bluebird');

module.exports = {
	retrieve: retrieve
};


function retrieve(config) {
	return function model(params) {
		params = params || {};

		var promise = orm.select({
			db:      db, 
			table:   config.table,
			where:   params.where,
			order:   params.order,
			limit:   params.limit,
			offset:  params.offset,
			group:   params.group
		});
		
		if (config.transforms) {
			_.each(config.transforms, function (transform) {
				promise = promise.map(transform);
			})
		}

		if (config.public_properties) {
			promise = promise.map(function (data) {
				return Promise.resolve(_.pick(data, config.public_properties));
			});
		}

		if (params.inflection === 'one') {
			promise = promise.then(function (data) {
				if (_.isEmpty(data)) return {};
				else return data[0];
			});
		}
		
		return promise;
	};
}