module.exports = function _route(app, view, middle) {
	var m;

	// Get all posts
	m = [middle.getAllPosts];
	app.get("/blog", m, function _index(req, res) {
		res.render("blog/index", {
			"posts": view.index(req.posts)
		});
	});

	m = [
		middle.cleanseUrl,
		middle.requireLogin,
		middle.beRaynos
	];
	app.get("/blog/new", m, function _new(req, res) {
		res.render("blog/new", view.flash(req.flash()));
	});

	// render the edit page
	m = [
		middle.cleanseUrl,
		middle.requireLogin,
		middle.beRaynos,
		middle.validate,
		middle.checkId,
		middle.getPostById
	];
	app.get("/blog/:postId/edit", m, function _edit(req, res, next) {
		var locals = view.fixURL(req.post);
		res.render("blog/edit", view.flash(req.flash(), locals));	
	});

	// render single post
	m = [
		middle.validate,
		middle.checkId,
		middle.getPostById
	]
	app.get("/blog/:postId/:title?", m, function _show(req, res, next) {
		res.render("blog/show", view.show(req.post));
	});

	// create new post
	m = [
		middle.requireLogin,
		middle.beRaynos,
		middle.validate,
		middle.validatePost,
		middle.createPost,
		middle.redirectToPost
	]
	app.post("/blog", m);

	// update document.
	m = [
		middle.requireLogin,
		middle.beRaynos,
		middle.validate,
		middle.checkId,
		middle.validatePost,
		middle.getPostById,
		middle.checkPostExistance,
		middle.savePost,
		middle.redirectToPost
	];
	app.put("/blog/:postId", m);

	m = [
		middle.requireLogin,
		middle.beRaynos,
		middle.validate,
		middle.checkId,
		middle.getPostById,
		middle.deletePost
	]
	app.delete("/blog/:postId", m, function _destroy(req, res) {
		res.redirect("/blog");
	});

};

