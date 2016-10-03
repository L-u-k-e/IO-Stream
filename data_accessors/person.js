var accessor_factory = require('../helpers/data-accessor-factory');

module.exports = accessor_factory.new({
	table: 'person',
	auto_uuid: 'id',
	properties: ['id', 'publisher', 'admin', 'first_name', 'last_name', 'last_token_invalidation', 'hash'],
	required_properties: ['id', 'publisher', 'admin', 'first_name', 'last_name'],
	public_properties: ['id', 'publisher', 'admin', 'first_name', 'last_name'],
	relationships: {}
});