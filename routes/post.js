module.exports = function _route(app, model, view, secure) {
	var getModel = function _getModel(req, res, next) {
		model.get(req.postId, function _get(err, rows) {
			if (err && err.message === "no results") {
				next(err);
			} else {
				req.rows = rows;
				next();
			}
		})	
	};

	app.param("postId", function _parseId(req, res, next, id) {
		req.postId = parseInt(req.params.postId, 10);
		next();
	});

	// Get all posts
	app.get("/blog", function _index(req, res) {
		model.get(function _get(err, rows) {
			res.render("blog/index", {
				"posts": rows.map(view.index.bind(view))
			});
		});
	});

	app.get("/blog/new", secure.requireLogin, function _new(req, res) {
		res.render("blog/new");
	});

	// create new post
	app.post("/blog", secure.requireLogin, secure.validatePost, function _create(req, res) {
		model.create(req.body, function _save() {
			res.redirect("blog/" + view.url(post));
		});	
	});

	// render the edit page
	app.get("/blog/:postId/edit", secure.requireLogin, secure.checkId, getModel, function _edit(req, res, next) {	
		res.render("blog/edit", view.fixURL(req.rows));	
	});

	// render single post
	app.get("/blog/:postId/:title?", secure.checkId, getModel, function _show(req, res, next) {
		res.render("blog/show", view.show(req.rows));
	});

	// update document.
	app.put("/blog/:postId", secure.requireLogin, secure.checkId, secure.validatePost, function _update(req, res) {
		model.save(req.postId, req.body, function _save(err, rows) {
			if (!err) {
				res.redirect("blog/" + view.url(post));	
			} else {
				next(err);
			}
		});
	});

	app.delete("/blog/:postId", secure.requireLogin, secure.checkId, function _destroy(req, res) {
		model.destroy(req.postId, function _delete() {
			res.redirect("/blog/");
		});	
	});

};

