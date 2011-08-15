var	dust = require("./lib/dust.js"),
	lessup = require("lessup"),
	configure = require('./app-configure.js'),
	fs = require("fs"),
	after = require("after");

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
	// configure & route
	configure(app);
	var routes = readFolder("/routes/"),
		models = readFolder("/model/"),
		views = readFolder("/views/");

	Object.keys(routes).forEach(function _initRoute(route) {
		routes[route](app, models[route], views[route]);
	});

	// configure less
	lessup.Watcher({
		lessFolders: ['/public/stylesheets'],
		cwd: __dirname,
		compileTo: '/public/stylesheets/site.css'
	});

	var start = after(Object.keys(models).length, function _waitForModels() {
		app.listen(parseInt(process.env.PORT) || 8080);
		console.log("Express server listening on port %d", app.address().port);
	});

	Object.keys(models).forEach(function _each(model) {
		models[model].on("loaded", start)
	})

	
}

