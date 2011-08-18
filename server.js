var express = require('express'),
	init = require("./app-init.js");

if (!module.parent) {
	var app = module.exports = express.createServer();
	init(app);
} else {
	module.exports = function _createServer(cb) {
		app = express.createServer();
		app.on("started", cb)
		init(app);
	}
}




