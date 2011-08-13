
// Configuration

var express = require("express"),
	uuid = require("node-uuid");

var configure = function(app) {

	app.configure(function(){
		app.set('views', __dirname + '/public/views');
		app.set('view engine', 'dust');
		app.set('controllers path', __dirname + '/controllers/');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.cookieParser());
		app.use(express.session({ secret: uuid()}));
		app.use(app.router);
		app.use(express.static(__dirname + '/public'));
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());
	});
};

module.exports = configure;
