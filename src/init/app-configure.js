var express = require("express"),
	trinity = require("trinity"),
	everyauth = require("everyauth"),
	uuid = require("node-uuid"),
	gzip = require('connect-gzip');

var configure = function(app) {

	app.configure(function() {
		trinity.set("path", __dirname + "/../public/trinity/");
		trinity.punchExpress();

		trinity.send = function _send(res, error, frag) {
			if (error) throw error;
			
			var doc = frag.ownerDocument;
			var section = doc.body.getElementsByTagName("section")[0];
			section.appendChild(frag);
			res.send(doc.innerHTML);
		};

		app.use(express.bodyParser());
		// Fixes PUT & DELETE on ajax
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: uuid() }));
		app.use(everyauth.middleware());
		app.use(app.router);
		app.use(express.static(__dirname + '/../public'));
		app.use(gzip.gzip());
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());

		process.on("uncaughtException", function (err) {
			console.log("error happened : ", err);
		})
	});
};

module.exports = configure;