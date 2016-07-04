var videos        = require('../models/videos');
var upload_tokens = require('../models/upload-tokens');
var generate_uuid = require('../helpers/uuid');
var input_binding = require('../helpers/flow_binder')
var _             = require('lodash');
var path          = require('path');
var fs            = require('fs');
var multer        = require('multer');




/* Get the file ID corresponding to a video ID by looking up the upload token. */
var get_upload_token = function (req, res, next) {
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
			var file_name = input_binding.get_chunk_file_name(args.chunk_number, args.file_id);
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
		var out = path.resolve('public', 'videos', req.query.video_id);
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




/* Delete the upload token since it's no longer necessary */
var delete_upload_token = function (req, res, next) {
	var args = _.pick(req, ['file_id', 'video_id']);
	upload_tokens.delete(args).then(function (result) {
		next();
	});
};



/* Send notice of merge completion to the client */
var send_merge_completion_notice = function (req, res, next) {
	res.status(201).json(req.new_video_row);
};




/* Get some videos */
var get_some = function (req, res, next) {
	var args = req.query;
	args.inflection = 'many';
	videos.get(args)
	.then(function (data) {
		res.status(200).json({
			message: 'Retrieved some videos.',
			data: data
		});
	})
	.catch (function (err) {
		console.log(err);
	});
};




module.exports = function (router) {

	/* Finalize a video upload (merge the chunks) */
	router.post('/api/videos', 
		input_binding.normalize_params,
		get_upload_token,
		merge_chunks,
		stamp_upload_time,
		delete_upload_token,
		send_merge_completion_notice
	);

	/* get some videos */
	router.get('/api/videos', get_some);

};
