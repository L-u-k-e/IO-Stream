var accessor_factory = require('../helpers/data-accessor-factory');
var person_accessor = require('./person');
var topic_accessor = require('./topic');

module.exports = accessor_factory.new({
	table: 'course',
	auto_uuid: 'id',
	properties: ['id', 'topic_id', 'semester_id', 'year', 'section', 'person_id' ],
	required_properties: ['id', 'topic_id', 'semester_id', 'year', 'person_id'],
	public_properties: this.properties,
	relationships: {
		person: {local_key: 'person_id', foreign_key: 'id', accessor: person_accessor},
		topic:  {local_key: 'topic_id',  foreign_key: 'id', accessor: topic_accessor }	
	}	
});