var videos = require('../models/videos.js');
var upload_tokens = require('../models/upload-tokens.js');
var generate_uuid = require('../helpers/uuid.js');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var multer = require('multer');

var staging_directory = path.resolve( 'videos', 'staging');
var upload = multer({dest: staging_directory});




/* Congregate / translate the parameters into more readable names and do some input sanitization. */
var normalize_params = function (req, res, next) {

	/* This function may be inserted into multiple routes, so we can't really be sure where the fields are */
	var find = function (name) {
		var field = req.query[name] || req.body[name] || req.params[name];
		return field;
	};

	req.chunk_number  = find('flowChunkNumber');  // The index of the chunk in the current upload. First chunk is 1.
	req.total_chunks  = find('flowTotalChunks');  // The total number of chunks.
	req.chunk_size    = find('flowChunkSize');    // The general chunk size. 
	req.file_size     = find('flowTotalSize');    // The total file size.
	req.file_id       = find('flowIdentifier');   // A unique identifier for the file contained in the request.
	req.file_name     = find('flowFilename');     // The original file name (since a bug in Firefox results in the file name not being transmitted in chunk multipart posts).
  req.relative_path = find('flowRelativePath'); // The file's relative path when selecting a directory (defaults to file name in all browsers except Chrome).
  req.video_id      = find('video_id');         // The UUID of the video (from the upload token)
  
  req.file_id = sanitize_string(req.file_id);
	next();
};




/* Strip illegal chars from a string */
var sanitize_string = function (string) {
	string = string || '';
	var clean = string.replace(/[^0-9A-Za-z_-]/g, '');
	return clean;
};




/* Calculate the file name of a chunk provided the file ID and the chunk's index. */
var get_chunk_file_name = function (chunk_number, chunk_id) {
  var file_name = path.resolve('videos', 'staging', chunk_id + '.' + chunk_number);
  return file_name;
};




/* Check to see if a chunk already exists.*/ 
var get_chunk_status = function (req, res) {
 	var file_name = get_chunk_file_name(req.chunk_number, req.file_id);
 	console.log(file_name);
 	fs.exists(file_name, function (exists) {
 		var status = exists ? 200 : 204;
 		console.log(status);
 		res.sendStatus(status);
 	});
};




/* Embed the relevant file/indexing information into the filename of the chunk that was just uploaded to the staging directory. */
var rename_uploaded_chunk = function (req, res, next) {
	var new_file_name = get_chunk_file_name(req.chunk_number, req.file_id);
	fs.rename(req.file.path, new_file_name, next);
};




/* Send a response to the client indicating that a new chunk was successfully created.  */
var send_chunk_completion_notice = function (req, res, next) {
  res.sendStatus(201);
};




/* Get the file ID corresponding to a video ID by looking up the upload token. */
var get_upload_token = function (req, res, next) {
	console.log(req.video_id);
	upload_tokens.get({video_id: req.video_id})
	.then(function (token) {
		req.file_id = token.file_id;
		next();	
	})
	.catch(function (err) { 
		res.sendStatus(400); 
	});
};




/* Merge uploaded chunks into a single file and delete the old chunks. */
var merge_chunks = (function () {

	var pipe_chunks = function (args) {
  	args.chunk_number = args.chunk_number || 1;
  	if (args.chunk_number > args.total_chunks) { 
  		args.write_stream.end();
  		args.next(); 
  	} else {
  		var file_name = get_chunk_file_name(args.chunk_number, args.file_id);
  		var read_stream = fs.createReadStream(file_name);
  		read_stream.pipe(args.write_stream, {end: false});
     	read_stream.on('end', function () {
     		//once we're done with the chunk we can delete it and move on to the next one.
     		fs.unlink(file_name);
      	args.chunk_number += 1;
      	pipe_chunks(args);
     	}); 
    }  
  };

  return function (req, res, next) {
		var out = path.resolve('videos', req.query.video_id);
		var write_stream = fs.createWriteStream(out);
  	pipe_chunks({
  		write_stream: write_stream,
  		file_id: req.file_id,
  		total_chunks: req.total_chunks,
  		next: next
  	});
  };

}());




/* Update the row in the video table with the upload date */
var stamp_upload_time = function (req, res, next) {
	var now = new Date();
	var args = {where: {id: req.video_id}, set: {date_uploaded: now }};
	videos.update(args)
	.then(function (data) {
		req.new_video_row = data;
		next();
	});
}; 




/* Send notice of merge completion to the client */
var send_merge_completion_notice = function (req, res, next) {
	res.status(201).json(req.new_video_row);
};




module.exports = function (router) {

	/* Check to see if a chunk has already been uploaded */
	router.get('/api/video-chunks', 
		normalize_params,
		get_chunk_status
	);

	/* Upload a new chunk */
	router.post('/api/video-chunks',
		upload.single('file'), 
		normalize_params,
		rename_uploaded_chunk,
		send_chunk_completion_notice
	);

	/* Finalize a video upload (merge the chunks) */
	router.post('/api/videos', 
		normalize_params,
		get_upload_token,
		merge_chunks,
		stamp_upload_time,
		send_merge_completion_notice
	);

};
