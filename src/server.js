var express = require('express'),
	init = require("./init/app-init.js"),
	app;

process.chdir(__dirname);

if (!module.parent) {
	app = module.exports = express.createServer();
	init(app);
} else {
	module.exports = function _createServer(cb) {
		if (app) {
			cb(app);
		} else {
			app = express.createServer();
			app.on("started", cb);
			init(app);
		}
	};
}




