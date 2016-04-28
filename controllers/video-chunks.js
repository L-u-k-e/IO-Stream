var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var multer = require('multer');

var staging_directory = path.resolve( 'videos', 'staging');
var upload  = multer({dest: staging_directory});



var sanitize_string = function (string) {
	var clean = string.replace(/[^0-9A-Za-z_-]/g, '');
	return clean;
}



/* Make sure the requests quack like file chunks. Also, rename the relevant properties so they're less pedantic. */
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

/* Congregate / translate the parameters into more readable names and do some input sanitization */
var normalize_params = function (req, res, next) {
	
	var fields = req[(req.method == 'GET' ? 'query' : 'body')];
	req.chunk_number  = fields.flowChunkNumber;  // The index of the chunk in the current upload. First chunk is 1.
	req.total_chunks  = fields.flowTotalChunks;  // The total number of chunks.
	req.chunk_size    = fields.flowChunkSize;    // The general chunk size. 
	req.file_size     = fields.flowTotalSize;    // The total file size.
	req.file_id       = fields.flowIdentifier;   // A unique identifier for the file contained in the request.
	req.file_name     = fields.flowFilename;     // The original file name (since a bug in Firefox results in the file name not being transmitted in chunk multipart posts).
  req.relative_path = fields.flowRelativePath; // The file's relative path when selecting a directory (defaults to file name in all browsers except Chrome).
  req.video_id      = fields.video_id;         // The UUID of the video (from the upload token)
  
  req.file_id = sanitize_string(req.file_id);
	next();

};




/* Check to see if a chunk already exists.*/ 
var get_chunk_status = function (req, res) {
 	var file_name = get_chunk_file_name(req.chunk_number, req.file_id);
 	fs.exists(file_name, function (exists) {
 		var status = exists ? 200 : 204;
 		res.sendStatus(status);
 	});
};




/* Calculate the file name of a chunk provided the file ID and the chunk's index. */
var get_chunk_file_name = function (chunk_number, chunk_id) {
  chunk_id = sanitize_chunk_id(chunk_id);
  var file_name = path.resolve('videos', 'staging', chunk_id + '.' + chunk_number);
  return file_name;
};


/* Embed the relevant file/indexing information into the filename of the chunk that was just uploaded to the staging directory. */
var rename_uploaded_chunk = function (req, res, next) {
	var new_file_name = get_chunk_file_name(req.chunk_number, req.file_id);
	fs.rename(req.file.path, new_file_name, next);
};


/* Send a response to the client indicating that a new chunk was successfully created.  */
var send_completion_notice = function (req, res, next) {
  res.sendStatus(201);
};






modules.exports = function (router) {
	
	/* Chunk status request */
	router.get('/api/video-chunks', 
		normalize_params,
		validate_params, 
		get_chunk_status
	);

	router.post('api/video-chunks',
		normalize_params,
		validate_params, 
		upload.single('file'), 
		rename_uploaded_chunk,
		send_completion_notice
	);

};