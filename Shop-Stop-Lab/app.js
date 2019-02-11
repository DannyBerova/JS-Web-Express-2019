const EXPRESS = require('express');
const CONFIG = require('./config/config');
const PORT = 8080;
const APP = EXPRESS();

let env = 'development';
require('./config/database.config')(CONFIG[env]);
require('./config/express')(APP, CONFIG[env]);
require('./config/passport')();
require('./config/routes')(APP);

APP.listen(PORT);
console.log(`Server is listening on port ${PORT}`);

module.exports = APP;