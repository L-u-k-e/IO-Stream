var upload_tokens = require('../models/upload-tokens.js');


 /* Make sure the request quacks like it should. */
var validate_params = function (req, res, next) {
	if (!req.params.file_id) next('file_id is required');
	next();
};

/* Strip invalid characters from the file ID. */
var sanitize_file_id = function (req, res, next) {
	req.file_id = req.params.file_id.replace(/[^0-9A-Za-z_-]/g, '');
	next();
};

/* Search for an existing video ID mapped to a file ID */
var lookup_upload_token = function (req, res, next) {
	var key = { file_id: req.file_id };
	upload_tokens.get(key)
	.then(function (token) { send_video_id({res: res, status: 200, id: token.video_id}); })
	.catch(function (err) { next(); });
};

/* Request that a new upload token be created and send the video ID to the client whenever one is allocated. */
var reserve_upload_token = function (req, res, next) {
	var key = { file_id: req.file_id };
	upload_tokens.create(key)
	.then(function (token) { send_video_id({res: res, status: 201, id: token.video_id}) })
	.catch(function (err) { next(err); });
};

/* Send a video ID back to the client */
var send_video_id = function (spec) {
	var new_token = (spec.status == 201);
	spec.res.status(spec.status).json({
		message: new_token ? 'Created a new upload token' : 'Retrieved an existing upload token',
		data: {
			video_id: spec.id,
			new: new_token
		}
	});
};



module.exports = function (router) {

	/* Either return an existing upload token or create a new one. */
	router.get('/api/upload-tokens/:file_id',
		validate_params,
		sanitize_file_id,
		lookup_upload_token,
		reserve_upload_token
	);

};