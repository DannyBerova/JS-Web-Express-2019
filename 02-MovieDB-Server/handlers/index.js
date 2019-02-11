const homeHandler = require("./homeHandler");
const staticFileHandler = require("./staticHandler");
const movieHandler = require("./movieHandler");
const errorHandler = require("./errorHandler");

module.exports = [homeHandler, staticFileHandler, movieHandler, errorHandler];
