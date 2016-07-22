var input_binding = require('../helpers/flow_binder')
var _             = require('lodash');
var path          = require('path');
var fs            = require('fs');
var multer        = require('multer');

var staging_directory = path.resolve('public', 'videos', 'staging');
var upload = multer({dest: staging_directory});




/* Check to see if a chunk already exists.*/ 
var get_chunk_status = function (req, res) {
	var file_name = input_binding.get_chunk_file_name(req.chunk_number, req.file_id);
	fs.exists(file_name, function (exists) {
		var status = exists ? 200 : 204;
		res.sendStatus(status);
	});
};




/* Embed the relevant file/indexing information into the filename of the chunk that was just uploaded to the staging directory. */
var rename_uploaded_chunk = function (req, res, next) {
	var new_file_name = input_binding.get_chunk_file_name(req.chunk_number, req.file_id);
	fs.rename(req.file.path, new_file_name, next);
};




/* Send a response to the client indicating that a new chunk was successfully created.  */
var send_chunk_completion_notice = function (req, res, next) {
	res.sendStatus(201);
};




module.exports = function (router) {

	/**
	 * @swagger	
	 * /api/video-chunks:
	 *   get:
	 *     tags:
	 *       - Video Chunks
	 *     description: Check to see if a video chunk has been uploaded
	 *     responses:
	 *       200:
	 *         description: Indicates that the chunk already exists.
	 *       204:
	 *         description: Indicates that the chunk has not yet been uploaded.
	 *     parameters:
	 *       - name: flowIdentifier
	 *         description: A client-provided file identifier unique to the source file of the chunk whose status is being requested 
	 *         type: string
	 *         required: true
	 *         in: query
	 *       - name: flowChunkNumber
	 *         description: The index of the chunk whose status is being requested
	 *         type:  integer
	 *         required: true
	 *         in: query
	 */
	router.get('/api/video-chunks', 
		input_binding.normalize_params,
		get_chunk_status
	);

		/**
	 * @swagger	
	 * /api/video-chunks:
	 *   post:
	 *     tags:
	 *       - Video Chunks
	 *     description: Upload a new chunk
	 *     responses:
	 *       201:
	 *         description: Indicates that the chunk was successfully uploaded.
	 *     parameters:
	 *       - name: file
	 *         description: The file chunk to be uploaded to the staging directory.
	 *         type: file
	 *         required: true
	 *         in: body
	 *       - name: flowIdentifier
	 *         description: A client-provided file identifier unique to the source file of the chunk whose status is being requested 
	 *         type: string
	 *         required: true
	 *         in: query
	 *       - name: flowChunkNumber
	 *         description: The index of the chunk whose status is being requested
	 *         type:  integer
	 *         required: true
	 *         in: query
	 */
	router.post('/api/video-chunks',
		upload.single('file'), 
		input_binding.normalize_params,
		rename_uploaded_chunk,
		send_chunk_completion_notice
	);

};
