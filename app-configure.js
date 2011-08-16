
// Configuration

var express = require("express"),
	uuid = require("node-uuid");

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
		/*app.use(function(req, res, next) { 
			res.status(404);
			res.render('404'); 
		});*/
	});

	app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function(){
		app.use(express.errorHandler());
	});
};

module.exports = configure;
