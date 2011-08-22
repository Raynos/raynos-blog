var express = require('express'),
	init = require("./app-init.js"),
	app;

if (!module.parent) {
	app = module.exports = express.createServer();
	init(app);
} else {
	var finished = false;

	module.exports = function _createServer(cb) {
		if (app) {
			cb(app);
		} else {
			app = express.createServer();
			app.on("started", cb)
			init(app);			
		}
	}
}




