var db            = require('../config/db_config');
var orm           = require('../helpers/orm');
var _             = require('lodash');
var model_factory = require('../helpers/model-factory');

var table = 'semester';
exports.get = model_factory.retrieve({table: table});
