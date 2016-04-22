var videos = require('../models/videos.js');
var generate_uuid = require('../helpers/uuid.js');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var multer = require('multer');


var staging_directory = path.resolve( 'videos', 'staging');
var upload = multer({dest: staging_directory});







/* 
 * Check for a UUID corresponding to the provided file ID in the 
 * upload_in_progress table. Return it if found, otherwise next(), so we can
 * reserve a new one.
 */ 
var fetch_uuid = function (req, res, next) {
	console.log(req);
	res.sendStatus(200); 
};


/* 
 * Request a new UUID for the provided file ID.
 */
var reserve_uuid = function (req, res, next) {

};

/*
 * Return a newly generated UUID to the client.
 */
var send_uuid = function (req, res, next) {

}










/*
 * Check to see if the incoming GET is a chunk status request.
 * Abort the current route if it is found not to be.
 */
var skim_for_status_req = function (req, res, next) {
	var arg = req.query.status_request ? undefined : 'route';
	next(arg);
};



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
	req.chunk_number  = fields.flowChunkNumber;  // The index of the chunk in the current upload. First chunk is 1.
	req.total_chunks  = fields.flowTotalChunks;  // The total number of chunks.
	req.chunk_size    = fields.flowChunkSize;    // The general chunk size. 
	req.file_size     = fields.flowTotalSize;    // The total file size.
	req.file_id       = fields.flowIdentifier;   // A unique identifier for the file contained in the request.
	req.file_name     = fields.flowFilename;     // The original file name (since a bug in Firefox results in the file name not being transmitted in chunk multipart posts).
  req.relative_path = fields.flowRelativePath; // The file's relative path when selecting a directory (defaults to file name in all browsers except Chrome).

	next();
};




/*   
	Check to see if a file corresponding to chunk information exists.  
	This would indicate that an upload is partially completed, allowing the
	client to confidently resume uploading at the first chunk that this 
	endpoint reports is non-existant.
*/ 
var get_chunk_status = function (req, res) {
 	var file_name = get_chunk_file_name(req.chunk_number, req.file_id);
 	fs.exists(file_name, function (exists) {
 		var status = exists ? 200 : 204;
 		res.sendStatus(status);
 	});
};



var get_chunk_file_name = function (chunk_number, chunk_id) {
  chunk_id = sanitize_chunk_id(chunk_id);
  var file_name = path.resolve('videos', 'staging', chunk_id + '.' + chunk_number);
  return file_name;
};



var sanitize_chunk_id = function (id) {
	var new_id = id.replace(/[^0-9A-Za-z_-]/g, '');
	return new_id;
};



/* Rename the file that was uploaded to the staging directory so that it conveys the necessary chunk information. */
var rename_uploaded_chunk = function (req, res, next) {
	var new_file_name = get_chunk_file_name(req.chunk_number, req.file_id);
	fs.rename(req.file.path, new_file_name, next);
};


/* Recursively check to see if we have every chunk of a file */
var check_completion_status = function (req, res, next) {
  var current_chunk = 1;
  var see_if_chunks_exist = function () {
    fs.exists(get_chunk_file_name(current_chunk, req.file_id), function (exists) {
    	if (current_chunk > req.total_chunks) { 
    		next(); 
    	}
	  	else if (exists) {
	    	current_chunk ++;
	      see_if_chunks_exist();
	    } else { 
	    	res.sendStatus(202);
	    } 
    });
  };
  see_if_chunks_exist();
};


/* Generate a new uuid and store it in the req stream for later. */
var get_new_uuid = function (req, res, next) {
   req.uuid = generate_uuid(true); 
   next();
};



/*  */
var merge_chunks = (function () {

	var pipe_chunks = function (args) {
  	args.chunk_number = args.chunk_number || 1;
  	if (args.chunk_number > args.total_chunks) { 
  		args.write_stream.end();
  		args.next(); 
  	} else {
  		var file_name = get_chunk_file_name(args.chunk_number, args.file_id)
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
		var out = path.resolve('videos', req.uuid);
		var write_stream = fs.createWriteStream(out);
  	pipe_chunks({
  		write_stream: write_stream,
  		file_id: req.file_id,
  		total_chunks: req.total_chunks,
  		next: next
  	});
  };

}());


var send_completion_notice = function (req, res, next) {
	res.status(201).json({uuid: req.uuid});
};


module.exports = function (router) {

	/* Reserve a new uuid */
	router.get('api/video-ids', 
		fetch_uuid, 
		reserve_uuid
	);

	/* Chunk status request */
	router.get('/api/videos', 
		skim_for_status_req, //next('route') if this isn't a chunk status request 
		validate_params, 
		get_chunk_status
	);

	/* Multiple video request */
	router.get('api/videos', function (req, res) { res.sendStatus(200); });	

	/* Video upload request */
	router.post('/api/videos', 
		upload.single('file'), 
		validate_params, 
		rename_uploaded_chunk,
		check_completion_status,
		merge_chunks,
		videos.create,
		send_completion_notice
	);

	/*video meta-data edit*/
	//router.patch()

};