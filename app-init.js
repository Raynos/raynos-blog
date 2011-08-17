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
	fs.readdirSync(__dirname + folder).map(function _mapRequire(file) {
		o[file] = require("." + folder + file);
	});
	return o;
};

module.exports = function _init(app) {
	// configure
	configure(app);

	// watch for less file changes
	var dir = __dirname + "/public/stylesheets"
	watch.watchTree(dir, function _onchange(f, curr, prev) {
		if (/.less/.test(f)) {
			console.log("rewriting less");
			var cmd = "lessc " + dir + "/site.less > " + dir + "/site.css"
			var less = exec(cmd);
		}
	});

	// Load the routes, models & views
	var routes = readFolder("/routes/"),
		models = readFolder("/model/"),
		views = readFolder("/views/"),
		middleware = readFolder("/middleware/");

	Object.keys(routes).forEach(function _initRoute(file) {
		var model = models[file],
			view = views[file],
			route = routes[file],
			middle = middleware[file];

		// for each route call it with app and its model & view.
		if (middle) {
			middle = middle(model, view);
		}
		route(app, view, middle)
	});

	// start the applications once all the models have loaded.
	
	var start = after(Object.keys(models).length, function _waitForModels() {
		app.listen(parseInt(process.env.PORT) || 8080);
		console.log("Express server listening on port %d", app.address().port);
	});

	Object.keys(models).forEach(function _each(model) {
		models[model].on("loaded", start);
		models[model].emit("start");
	})

	
}

