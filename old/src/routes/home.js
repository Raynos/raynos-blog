module.exports = route;

function route(app, controller) {
	app.get('/', controller.home);

	app.get("/rss", controller.rss);
}



