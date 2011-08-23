var	dust = require("./lib/dust.js"),
	configure = require('./app-configure.js'),
	fs = require("fs"),
	// Remove in 0.6 and use Buffer.prototype.toString("hex") instead
	buffertools = require("buffertools"),
	watch = require("watch"),
	after = require("after"),
	exec = require("child_process").exec;

// temporary error logging
/*process.on('uncaughtException', function (err) {
	console.log('Caught exception: ');
	console.log(err);
});*/

var readFolder = function _readFolder(folder) {
	var o = {};
	fs.readdirSync(__dirname + folder).forEach(function _each(file) {
		if (/\.js/.test(file))	{
			o[file] = require(__dirname + folder + "/" + file);
		} else {
			o[file] = readFolder(folder + "/" + file);
		}
	});
	return o;
};

module.exports = function _init(app) {
	// configure
	configure(app);

	// watch for less file changes
	var dir = __dirname + "/public/stylesheets";
	watch.watchTree(dir, function _onchange(f, curr, prev) {
		if (/.less/.test(f)) {
			console.log("rewriting less");
			var cmd = "lessc " + dir + "/site.less > " + dir + "/site.css";
			var less = exec(cmd);
		}
	});

	// Load the routes & middleware
	var routes = readFolder("/routes/"),
		middlewareList = readFolder("/middleware/");

	// neating the middleware list structure
	var middleware = {};
	Object.keys(middlewareList).forEach(function _each(folder) {
		Object.keys(middlewareList[folder]).forEach(function _each(file) {
			var module = middlewareList[folder][file];
			middleware[file] = middleware[file] || {};
			middleware[file][folder] = module;
		});
	});

	var dataList = {};

	// initialize routes
	Object.keys(routes).forEach(function _initRoute(file) {
		var route = routes[file],
			middle = middleware[file];

		if (route && middle && middle.data) {
			dataList[file] = middle.data
		}

		route(app, middle);
	});	

	console.log(dataList);

	// start the applications once all the models have loaded.
	var start = after(Object.keys(dataList).length, function _waitForData() {
		app.listen(parseInt(process.env.PORT, 10) || 8080);
		app.emit("started", app);
		console.log("Express server listening on port %d", app.address().port);
	});

	Object.keys(dataList).forEach(function _each(data) {
		dataList[data].on("loaded", start);
		console.log("emitting");
		dataList[data].emit("start");
	});
	
};

