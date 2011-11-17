var	dust = require("../../lib/dust.js"),
	configure = require('./app-configure.js'),
	everyauth = require("./everyauth.js"),
	fs = require("fs"),
	after = require("after"),
	exec = require("child_process").exec;

function readLessFiles() {
	// watch for less file changes
	var dir = __dirname + "/../public/stylesheets";
	fs.watch(dir, function _onchange(ev, filename) {
		if (/.less/.test(filename)) {
			var cmd = "lessc " + dir + "/site.less > " + dir + "/site.css";
			var less = exec(cmd);
		}
	});
}

function readRoutes() {
	// Load the routes & middleware
	fs.readdir("../routes/", function (files) {
		files.forEach(function (file) {
			require("../routes/" + file)(app);	
		});
	});
}

function loadModules() {
	// start the applications once all the models have loaded.
	fs.readdir("../data/", function (files) {
		var start = after(files.length, startServer);	
		files.forEach(function (file) {
			var module = require("../data/" + file);
			module.on("loaded", start);
			module.emit("start");
		});
	});
}

function startServer() {
	app.listen(parseInt(process.env.PORT, 10) || 8080);
	app.emit("started", app);
	console.log("Express server listening on port %d", app.address().port);
}

module.exports = function _init(app) {
	configure(app);
	readLessFiles();
	readRoutes();
	loadModules();
	everyauth(app);
};

