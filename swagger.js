var swagger = require('swagger-jsdoc');

// swagger definition
var swagger_def = {
  info: {
    title: 'IO Stream',
    version: '0.0.1',
    description: 'A video sharing platform for lectures',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
var options = {
  // import swaggerDefinitions
  swaggerDefinition: swagger_def,
  // path to the API docs
  apis: ['./controllers/*.js'],
};


module.exports = swagger(options);