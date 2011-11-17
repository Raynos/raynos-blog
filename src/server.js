var express = require('express'),
	init = require("./init/app-init.js"),
	app;

process.chdir(__dirname);

app = module.exports = express.createServer();
init(app);

module.exports = function _createServer(cb) {
	if (app.address()) {
		return app;
	}
	app.on("started", cb);
};