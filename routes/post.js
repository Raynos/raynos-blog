module.exports = function _route(app, model, view) {

	// Get all posts
	app.get("/blog", function _index(req, res) {
		model.get(function _get(err, rows) {
			res.render("blog/index", {
				"posts": rows.map(view.index.bind(view))
			});
		});
	});

	app.get("/blog/new", function _new(req, res) {
		res.render("blog/new");
	});

	// create new post
	app.post("/blog", function _create(req, res) {
		var post = {
			"content": req.body.content,
			"title": req.body.title,
			"datetime": Date.now(),
			"type": "post"
		}

		model.get(function _get(err, rows) {
			// get highest id and make the new id one higher.
			var id = rows.map(function _pluckId(v) {
				return v.value.id;
			}).reduce(function _findMaxId(prev, curr) {
				return prev < curr ? curr : prev;
			}, 0);

			post.id = ++id;

			model.create(post, function _save() {
				res.redirect("blog/" + view.url(post));
			});
		});
	});

	// render the edit page
	app.get("/blog/:id/edit", function _edit(req, res) {
		var id = +req.params.id
		
		model.get(id, function _get(err, rows) {
			res.render("blog/edit", view.fixURL(rows));
		});
	});

	// render single post
	app.get("/blog/:id/:title", function _show(req, res, next) {
		var id = +req.params.id;

		model.get(id, function _get(err, rows) {
			// if doc with id does not exist then 404
			if (err && err.message === "no results") {
				next();
			} else {
				res.render("blog/show", view.show(rows));
			}
		});
	});

	// update document.
	app.put("/blog/:id", function _update(req, res) {
		var id = +req.params.id;
		
		var post = {
			"title": req.body.title,
			"content": req.body.content,
			"id": id
		};

		model.save(post, function _save() {
			res.redirect("blog/" + view.url(post));
		});
	});

	app.delete("/blog/:id", function _destroy(req, res) {
		var id = +req.params.id;

		model.destroy(id, function _delete() {
			res.redirect("/blog/");
		});
	});

};

