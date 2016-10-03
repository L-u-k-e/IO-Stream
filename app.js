require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookie_parser = require('cookie-parser');
var body_parser = require('body-parser');
var helmet = require('helmet');

var key_manager = require('./helpers/jwt-key-manager');
key_manager.load_key();

var query_parser = require('./middleware/query-parser');
var routes = require('./routes/index');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(query_parser);
app.use('/', routes);

app.get('/api/docs', function (req, res) {
  res.sendFile('api-docs/index.html', {root: path.join(__dirname, 'public')});
});


app.use('*', function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err.message
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

module.exports = app;
