var Post = require("../domain/post.js"),
	PostModel = require("../data/post.js"),
	ViewModel = require("../viewmodels/post.js");

var authorized = [requireLogin, beRaynos];

module.exports = {
	index: index,
	renderCreate: [authorized, renderCreate],
	renderEdit: [authorized, fetchPost, renderEdit],
	view: [fetchPost, view],
	createPost: [authorized, validatePost, createPost],
	updatePost: [authorized, validatePost, updatePost],
	deletePost: [authorized, deletePost]
};

function index(req, res) {
	Post.all(all);

	function all(err, posts) {
		var data = ViewModel.index(posts);
		data.user = req.user;
		res.render("post/index", data);
	}
}

function renderCreate(req, res) {
	res.render("post/new");
}

function renderEdit(req, res) {
	res.render("post/edit", ViewModel.view(req.post));
}

function view(req, res) {
	var data = ViewModel.view(req.post);
	data.user = req.user;
	res.render("post/view", data);
}

function createPost(req, res) {
	Post.construct(req.body, handleCreate);

	function handleCreate(err, post) {
		res.redirect("/blog/" + ViewModel.makeUrl(post));
	}
}

function updatePost(req, res) {
	var id = parseInt(req.params.postId, 10);
	Post.update(id, req.body, handleUpdate);

	function handleUpdate(err, post) {
		res.redirect("/blog/" + ViewModel.makeUrl(post));
	}
}

function deletePost(req, res) {
	var id = parseInt(req.params.postId, 10);
	Post.delete(id, handleDelete);

	function handleDelete(err, post) {
		res.redirect("/");
	}
}

function fetchPost(req, res, next) {
	var id = parseInt(req.params.postId, 10);
	Post.get(id, handleGet);

	function handleGet(err, post) {
		req.post = post;
		next();
	}
}

function validatePost(req, res, next) {
	var errors = Post.validate(req.body);
	if (errors) {
		req.body.errors = errors;
		return res.render("post/edit", View.view(req.body));
	}
	next();
}

function requireLogin(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect('/login/');
	}
}

function beRaynos(req, res, next) {
	if (req.user.name === "Raynos") {
		next();
	} else {
		next(new Error("Your not Raynos"));
	}
}