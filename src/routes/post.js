var Post = require("../domain/post.js"),
	PostModel = require("../data/post.js"),
	View = require("../view/post.js");

module.exports = function _route(app) {

	var authorized = [
		function _requireLogin(req, res, next) {
			if (req.user) {
				next();
			} else {
				res.redirect('/login/');
			}
		},
		function _beRaynos(req, res, next) {
			if (req.user.name === "Raynos") {
				next();
			} else {
				next(new Error("Your not Raynos"));
			}
		}	
	];

	function fetchPost(req, res, next) {
		var id = parseInt(req.params.postId, 10);
		Post.get(id, function _get(err, post) {
			req.post = post;
			next();
		});
	}

	function validatePost(req, res, next) {
		var errors = Post.validate(req.body);
		if (errors) {
			req.body.errors = errors;
			return res.render("post/edit", View.view(req.body));
		}
		next();
	}

	app.get("/blog", function _index(req, res) {
		Post.all(function _all(err, posts) {
			res.render("post/index", View.index(posts));
		});
	});

	app.get("/blog/new", authorized, function _new(req, res) {
		res.render("post/new");
	});

	app.get("/blog/:postId/edit", fetchPost, function _edit(req, res) {
		res.render("post/edit", View.view(req.post));
	});

	app.get("/blog/:postId/:title?", fetchPost, function _view(req, res) {
		res.render("post/view", View.view(req.post));
	});

	app.post("/blog", [
		authorized, 
		validatePost, 
		function _create(req, res) {
			Post.create(req.body, function (err, post) {
				res.redirect("/blog/" + View.makeUrl(post));
			});
		}
	]);
	
	app.put("/blog/:postId", [
		authorized, 
		validatePost, 
		function _update(req, res) {
			var id = parseInt(req.params.postId, 10);
			Post.update(id, req.body, function (err, post) {
				res.redirect("/blog/" + View.makeUrl(post));
			});
		}
	]);

/*
	app.del("/blog/:postId", [
		authorized,
		middle.data.deletePost,
		middle.output.redirectToBlog
	]);
*/
};

