const http = require('http');
const url = require('url');
const handlers = require('./handlers/handlerBlender');
const config = require('./config/config');
const database = require('./config/mongoDb');

const port = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

database(config[environment]);

http
  .createServer((req, res) => {
    for (let handler of handlers) {
      req.pathname = url.parse(req.url).pathname;
      let task = handler(req, res);
      if (task !== true) {
        break;
      }
    }
  })
  .listen(port, () => {
    console.log('Server is listening on port: ' + port);
  });