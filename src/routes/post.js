module.exports = route;

function route(app, controller) {
	app.get("/blog", controller.index);

	app.get("/blog/new", controller.renderCreate);

	app.get("/blog/:postId/edit", controller.renderEdit);

	app.get("/blog/:postId/:title?", controller.view);

	app.post("/blog", controller.createPost);
	
	app.put("/blog/:postId", controller.updatePost);

	app.del("/blog/:postId", controller.deletePost);
}