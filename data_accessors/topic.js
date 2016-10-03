var accessor_factory = require('../helpers/data-accessor-factory');

module.exports = accessor_factory.new({
	table: 'topic',
	auto_uuid: 'id',
	public_properties: [
		'id',
		'subject_id',
		'title',
		'description',
		'date_created'
	],
	relationships: {}	
});