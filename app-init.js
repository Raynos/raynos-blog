var	dust = require("./lib/dust.js"),
	lessup = require("lessup")

// temporary error logging
/*process.on('uncaughtException', function (err) {
	console.log('Caught exception: ');
	console.log(err);
});*/

module.exports = function _init(app) {
	// configure less
	lessup.Watcher({
		lessFolders: ['/public/stylesheets'],
		cwd: __dirname,
		compileTo: '/public/stylesheets/site.css'
	});

	app.listen(parseInt(process.env.PORT) || 8080);
	console.log("Express server listening on port %d", app.address().port);	
}

