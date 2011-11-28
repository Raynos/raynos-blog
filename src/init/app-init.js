var	configure = require('./app-configure.js'),
	everyauth = require("./everyauth.js"),
	fs = require("fs"),
	after = require("after");

module.exports = init;

function init(app) {
	startServer = startServer.bind(null, app);
	everyauth(app);
	readRoutes(app);
	loadModules();
	configure(app);
}

function readRoutes(app) {
	// Load the routes & middleware
	fs.readdir(__dirname + "/../routes", function (err, files) {
		files.forEach(function (file) {
			require("../routes/" + file)(
				app,
				require("../controllers/" + file)
			);	
		});
	});
}

function loadModules() {
	// start the applications once all the models have loaded.
	fs.readdir(__dirname + "/../data/", function (err, files) {
		var start = after(files.length, startServer);	
		files.forEach(function (file) {
			var module = require("../data/" + file);
			module.on("loaded", start);
			module.start();
		});
	});
}

function startServer(app) {
	app.listen(parseInt(process.env.PORT, 10) || 8080, function (err, port) {
		if (err) console.log(err);
		app.emit("started", app);
		console.log("Express server listening on port %d", app.address().port);		
	});
}

