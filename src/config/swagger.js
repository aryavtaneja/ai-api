const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'AI API',
      version: '1.0.0',
    },
  },
  apis: [
    'src/routes/*.js'
  ],
};

module.exports = swaggerJsdoc(options);