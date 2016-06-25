/*
 * Author: Lucas Parzych
 * Email:  parzycl1@sunyit.edu
 * 
 * Description:
 *  A client side library named "flow" is used to faucilitate the video 
 *  "chunking" for the resumable uploads. Depending on the nature of the
 *  request, the book keeping information that it sends may be in either 
 *  the body or the query string parameters. 
 *
 *  This function is meant to "normalize" the input by: copying the parameters
 *  to the top-level req object and renaming them so they're more intuitive. 
 *  It also does some basic santizing on the file identifier so that it can be 
 *  used in a file name. 
 */
var path = require('path');



exports.normalize_params = function (req, res, next) {

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
	
	var id = (req.file_id || '');
	req.file_id = id.replace(/[^0-9A-Za-z_-]/g, '');
	next();
};




/* Calculate the file name of a chunk provided the file ID and the chunk's index. */
exports.get_chunk_file_name = function (chunk_number, chunk_id) {
	var file_name = path.resolve('videos', 'staging', chunk_id + '.' + chunk_number);
	return file_name;
};
