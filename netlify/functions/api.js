const serverless = require('serverless-http');
const app = require('../../server'); // This points to your main server.js file

module.exports.handler = serverless(app);