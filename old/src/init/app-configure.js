var express = require("express"),
	trinity = require("trinity"),
	everyauth = require("everyauth"),
	uuid = require("node-uuid"),
	gzip = require('connect-gzip');

function configure(app) {

	app.configure(configure);

	app.configure('development', development);

	app.configure('production', production);

	function production(){
		app.use(express.errorHandler());

		process.on("uncaughtException", uncaughtException);

		function uncaughtException(err) {
			console.log("error happened : ", err);
		}
	}

	function development(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	}

	function configure() {
		trinity.set("path", __dirname + "/../trinity/");
		trinity.set("publicPath", "/");
		trinity.punchExpress();

		trinity.send = send;

		app.use(express.bodyParser());
		// Fixes PUT & DELETE on ajax
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: uuid() }));
		app.use(everyauth.middleware());
		app.use(app.router);
		app.use(express.static(__dirname + '/../trinity'));
		app.use(gzip.gzip());

		function send(res, error, frag) {
			if (error) throw error;
			
			var doc = frag.ownerDocument;
			var section = doc.body.getElementsByTagName("section")[0];
			section.appendChild(frag);
			res.send(doc.innerHTML);
		}
	}
};

module.exports = configure;