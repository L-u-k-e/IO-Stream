ar db = require('../config/db_config.js');

exports.get = function (req, res, next) {
	db.one('select video_id from upload where file_id = $1', req.file_id)
	.then(function (data) {
		res.found_file = true;
		res.video_id = data.id;
		next();
	})
	.catch(function (err) {
		res.found_file = false;
		next();
	});
};