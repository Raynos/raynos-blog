var express = require('express'),
	configure = require('./app-configure.js'),
	route = require("./routes/"),
	init = require("./app-init.js");

var app = module.exports = express.createServer();

// configure & route
configure(app);
route(app);

if (!module.parent) {
	init(app);
}




