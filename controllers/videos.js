var videos = require('../models/videos.js');
var generate_uuid = require('../helpers/uuid.js');
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var multer = require('multer');


var staging_directory = path.resolve( 'videos', 'staging');
var upload = multer({dest: staging_directory});





















/*
 * Check to see if the incoming GET is a chunk status request.
 * Abort the current route if it is found not to be.
 */
var skim_for_status_req = function (req, res, next) {
	var arg = req.query.status_request ? undefined : 'route';
	next(arg);
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
     		console.log('deleting ' + file_name);
     		fs.unlink(file_name, function (error) {
     			console.log(error);
     		});
      	args.chunk_number += 1;
      	pipe_chunks(args);
     	}); 
     	read_stream.on('error', function (error) {
     		console.log(error);
     	});
    }  
  };

  return function (req, res, next) {
  	console.log('\n\n\nMERGING\n\n\n');
		var out = path.resolve('videos', req.video_id);
		var write_stream = fs.createWriteStream(out);
  	pipe_chunks({
  		write_stream: write_stream,
  		file_id: req.file_id,
  		total_chunks: req.total_chunks,
  		next: next
  	});
  };

}());



/* Record the current date so it can be updated in the table row. */
var record_upload_date = function (req, res, next) {
	var now = new Date();
	req.sql = { date_uploaded: now };
	console.log(req.sql);
	next();
}; 





var send_completion_notice = function (req, res, next) {
	res.status(201).json({uuid: req.uuid});
};


var get_upload_token = function (req, res, next) {
	var key = { file_id: req.query.video_id };
	uploads.lookup(key)
	.then(function (token) {
		if (_.isEmpty(token)) {
			res.sendStatus(400);
		} else {
			req.file_id = token.file_id;
			next();
		}
	})

};


module.exports = function (router) {

	/* Video upload request */
	router.post('/api/videos', 
		get_upload_token,
		merge_chunks,
		record_upload_date,
		videos.update,
		send_completion_notice
	);

};