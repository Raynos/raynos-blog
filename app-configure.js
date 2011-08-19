
// Configuration

var express = require("express"),
	uuid = require("node-uuid"),
	gzip = require('connect-gzip');

var configure = function(app) {

	app.configure(function(){
		app.set('views', __dirname + '/public/templates');
		app.set('view engine', 'dust');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: uuid() }));
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));
		app.use(gzip.gzip());
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());
	});
};

module.exports = configure;
