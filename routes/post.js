module.exports = function _route(app, middle) {

	app.get("/blog", [
		middle.data.getAllPosts,
		middle.output.renderPosts
	]); 

	app.get("/blog/new", [
		middle.input.cleanseUrl,
		middle.auth.requireLogin,
		middle.auth.beRaynos,
		middle.output.renderNewPostForm
	]);

	app.get("/blog/:postId/edit", [
		middle.input.cleanseUrl,
		middle.auth.requireLogin,
		middle.auth.beRaynos,
		middle.input.validate,
		middle.input.checkId,
		middle.data.getPostById,
		middle.output.renderPostEditForm
	]);

	app.get("/blog/:postId/:title?", [
		middle.input.validate,
		middle.input.checkId,
		middle.data.getPostById,
		middle.output.renderPost
	]);

	app.post("/blog", [
		middle.auth.requireLogin,
		middle.auth.beRaynos,
		middle.input.validate,
		middle.input.validatePost,
		middle.data.createPost,
		middle.output.redirectToPost
	]);

	app.put("/blog/:postId", [
		middle.auth.requireLogin,
		middle.auth.beRaynos,
		middle.input.validate,
		middle.input.checkId,
		middle.input.validatePost,
		middle.data.getPostById,
		middle.input.checkPostExistance,
		middle.data.savePost,
		middle.output.redirectToPost
	]);

	app.del("/blog/:postId", [
		middle.auth.requireLogin,
		middle.auth.beRaynos,
		middle.input.validate,
		middle.input.checkId,
		middle.data.getPostById,
		middle.data.deletePost,
		middle.output.redirectToBlog
	]);
};

