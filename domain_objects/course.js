var course_accessor = require('../data_accessors/course')

module.exports = {
	read:    course_accessor.read,
	create:  course_accessor.create,
	update:  course_accessor.update,
	replace: course_accessor.replace,
	remove:  course_accessor.remove
};