var express = require('express');
var router = express.Router();
var models = {};
models.courses = require('../models/courses.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, '../public')} );
});

router.get('/api/courses', models.courses.get_all);
router.get('/api/courses/:id', models.courses.get);
//router.post('/api/courses', models.courses.create);
//router.put('/api/courses/:id', models.courses.update);
//router.delete('/api/courses/:id', models.courses.delete)

module.exports = router;
