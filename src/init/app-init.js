var	configure = require('./app-configure.js'),
	everyauth = require("./everyauth.js"),
	http = require("http"),
	path = require("path"),
	less = require("less"),
	fs = require("fs"),
	after = require("after");

function readLessFiles() {
	function render(err, css) {
		var uri = dir + "/../trinity/static.css";
		var buf = new Buffer(css);
		fs.writeFile(uri, buf, "uft8", function (err) {
			console.log(err);
		});
	}

	function readFile(err, file) {
		less.render(file.toString(), render);
	}

	function onchange(ev, filename) {
		console.log("file changed!", filename);
		if (/.less/.test(filename)) {
			fs.readFile(path.join(dir, filename), readFile);
		}
	}

	// watch for less file changes
	var dir = __dirname + "/../public/stylesheets";
	fs.watch(dir, onchange);
}

function readRoutes(app) {
	// Load the routes & middleware
	fs.readdir(__dirname + "/../routes", function (err, files) {
		files.forEach(function (file) {
			require("../routes/" + file)(app);	
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
	var l = app.listen(parseInt(process.env.PORT, 10) || 8080);
	app.emit("started", app);

	console.log("Express server listening on port %d", app.address().port);	
}

module.exports = function _init(app) {
	startServer = startServer.bind(null, app);
	everyauth(app);
	readLessFiles();
	readRoutes(app);
	loadModules();
	configure(app);
};

