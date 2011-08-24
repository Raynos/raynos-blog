module.exports = function _route(app, middle) {

	var authorized = [
		middle.auth.requireLogin,
		middle.auth.beRaynos
	];

	app.param("postId", 
		middle.input.validate,
		middle.input.checkId,
		middle.data.getPostById,
		middle.input.checkPostExistance
	);

	app.get("/blog", [
		middle.data.getAllPosts,
		middle.output.renderPosts
	]); 

	app.get("/blog/new", [
		middle.input.cleanseUrl,
		authorized,
		middle.output.renderNewPostForm
	]);

	app.get("/blog/:postId/edit", [
		middle.input.cleanseUrl,
		authorized,
		middle.output.renderPostEditForm
	]);

	app.get("/blog/:postId/:title?", [
		middle.output.renderPost
	]);

	app.post("/blog", [
		authorized,
		middle.input.validate,
		middle.input.validatePost,
		middle.data.createPost,
		middle.output.redirectToPost
	]);

	app.put("/blog/:postId", [
		authorized,
		middle.input.validatePost,
		middle.data.savePost,
		middle.output.redirectToPost
	]);

	app.del("/blog/:postId", [
		authorized,
		middle.data.deletePost,
		middle.output.redirectToBlog
	]);
};

