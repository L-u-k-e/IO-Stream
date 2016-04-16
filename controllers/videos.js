var videos = require('../models/videos.js');
var generate_uuid = require('../helpers/uuid.js');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var multer = require('multer');


var staging_directory = path.resolve( 'videos', 'staging');
var upload = multer({dest: staging_directory});




var validate_params = function (req, res, next) {
  var fields = req[(req.method == 'GET' ? 'query' : 'body')];
	var error = undefined;
/*
	_.each(['flowChunkSize', 'flowTotalSize', 'flowTotalChunks'], function (k) {
		if (!fields[k]) { error = 'Parameter: ' + k + ' must be a positive integer (and is a required field).'; }
	});

	if (_.isEmpty(fields.flowIdentifier)) { 
		'Parameter: ' + k + ' must be a non-null string (and is a required field).'
	}

	if (fields.flowCurrentChunkSize) {
		//make sure incoming chunks are the right size. 
		if (fields.flowChunkNumber < fields.flowTotalChunks && fields.flowCurrentChunkSize !== fields.flowChunkSize) {
			error = 'Actual chunk size and reported chunk size do not match.';
		} else if (fields.flowTotalChunks > 1 
			&& fields.flowChunkNumber == fields.flowTotalChunks 
			&& fields.flowCurrentChunkSize != ((fields.flowTotalSize % fields.chunkSize) + parseInt(chunkSize))))
	}

	next(error);
	*/
	next();
};


/*   
	Check to see if a file corresponding to chunk information exists.  
	This would indicate that an upload is partially completed, allowing the
	client to confidently resume uploading at the first chunk that this 
	endpoint reports is non-existant.
*/ 
var get_chunk_status = function (req, res) {
 	var file_name = get_chunk_file_name(req.query.flowChunkNumber, req.query.flowIdentifier);
 	fs.exists(file_name, function (exists) {
 		var status = exists ? 200 : 204;
 		res.sendStatus(status);
 	});
};



var write_chunk = function (req, res, next) {

};



var skim_for_status_req = function (req, res, next) {
	var arg = req.query.status_request ? undefined : 'route';
	next(arg);
};


var sanitize_chunk_id = function (id) {
	var new_id = id.replace(/[^0-9A-Za-z_-]/g, '');
	return new_id;
};

var get_chunk_file_name = function (chunk_number, chunk_id) {
  chunk_id = sanitize_chunk_id(chunk_id);
  var file_name = path.resolve('videos', 'staging', chunk_id + '.' + chunk_number);
  return file_name;
};



var rename_uploaded_file = function (req, res, next) {
	//rename the file that was uploaded to the staging directory so that it conveys the necessary chunk information. 
	var new_file_name = get_chunk_file_name(req.body.flowChunkNumber, req.body.flowIdentifier);
	fs.rename(req.file.path, new_file_name, function() {
		//If this was the last chunk, then next(). Otherwise, we're done for now. 

	});
};

module.exports = function (router) {

	/* chunk status request */
	router.get('/api/videos', 
		skim_for_status_req, 
		validate_params, 
		get_chunk_status
	);

	/* multiple video request */
	router.get('api/videos', function (req, res) { res.sendStatus(200); });	

	/* video upload request */
	router.post('/api/videos', 
		validate_params, 
		upload.single('file'), 
		rename_uploaded_file,
		send_completion_update
	);

	/*video meta-data edit*/
	//router.patch()

};