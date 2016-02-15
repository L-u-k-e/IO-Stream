var express = require('express'),
		path = require('path'),
		app = express(),
		server;

//set up static file serving
app.use(express.static(__dirname + '/public', {index: 'index.html'}));

//listen
server = app.listen(8000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('test app listening at http://%s:%s', host, port);
});  



