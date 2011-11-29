var express = require('express'),
	init = require("./init/app-init.js"),
	app;

process.chdir(__dirname);

app = module.exports = express.createServer();
init(app);

module.exports = createServer;

function createServer(cb) {
	if (app.address()) {
		return cb(app);
	}
	app.on("started", cb);
}