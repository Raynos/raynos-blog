var validate = require("./common.js").validate,
	Trait = require("traits").Trait;


var flashMessages = {
	"content": "body content is not set",
	"title": "body title is not set"
}

module.exports = function _createMiddleware(model, view) {
	return Trait.create(Object.prototype, Trait({
		"validate": function _validate(req, res, next) {
			req.validator = function(defaults) {
				if (defaults === undefined || defaults === true) {
					return validate({
						"redirectOnInvalid": res,
						"flashOnError": {
							"req": req,
							"messages": flashMessages
						}
					});	
				} else if (defaults === false) {	
					return validate();
				} else {
					return validate(defaults);
				}
			}
			next();
		},
		"beRaynos": function _beRaynos(req, res, next) {
			if (req.session.user.name === "Raynos") {
				next();
			} else {
				next(new Error("Your not Raynos"));
			}
		},
		"cleanseUrl": function _cleanseUrl(req, res, next) {
			if (req.url.charAt(req.url.length - 1) === "?") {
				req.url = req.url.substring(0, req.url.length - 1);
			}
			next();
		},
		"requireLogin": function _requireLogin(req, res, next) {
			if (req.session.user) {
				next();
			} else {
				res.redirect('/login/' + encodeURIComponent(req.url));
			}
		},
		"checkId": function _checkId(req, res, next) {
			var id = parseInt(req.params.postId, 10);
			req.validator({
				"errorNextOnError": next
			}).on("valid", function _valid() {
				req.postId = id;
			}).run(function _checkId(check) {
				check(id, 'id is not a number').isInt();
			}, next);
		},
		"getAllPosts": function _getAllPosts(req, res, next) {
			model.get(function _getAll(err, res, body) {
				if (err) {
					next(err)
				} else if (body.rows !== undefined) {
					req.posts = body;
					next();	
				} else {
					next(new Error(body.error));
				}
			});
		},
		"createPost": function _createPost(req, res, next) {
			model.create(req.body, function _save(err, res, body) {
				if (err) {
					next(err);
				} else if (body.ok === true) {
					req.post = body;
					next();
				} else {
					next(new Error(body.error));
				}
			});	
		},
		"getPostById": function _getModel(req, res, next) {
			model.get(req.postId, function _get(err, res, body) {
				if (err) {
					next(err);
				} else if (body._id !== undefined) {
					req.post = body;
					next();
				} else {
					next(new Error(body.error));
				}
			})	
		},
		"validatePost": function _validatePost(req, res, next) {
			req.validator().run(function _validatePost(check) {
				check(req.body.content, "content").len(1).notEmpty();
				check(req.body.title, "title").len(1).notEmpty();
			}, next);
		},
		"redirectToPost": function _redirectToPost(req, res, next) {
			res.redirect("blog/" + view.url(req.post));
		},
		"checkPostExistance": function _checkPostExistance(req, res, next) {
			req.validator({
				"errorNextOnError": next
			}).run(function _checkExistance(check) {
				check(req.post, "post does not exist").isDefined();
			}, next);
		},
		"savePost": function _savePost(req, res, next) {
			Object.keys(req.body).forEach(function _copyValues(key) {
				req.post[key] = req.body[key];
			});
			model.save(req.post, function _save(err, res, body) {
				if (err) {
					next(err);
				} else if (body.ok === true) {
					next();
				} else {
					next(new Error(body.error));
				}
			});
		},
		"deletePost": function _deletePost(req, res, next) {
			model.destroy(req.post, function _delete(err, res, body) {
				if (err) {
					next(err);
				} else if (body.ok === true || body === "") {
					next();
				} else {
					next(new Error(body.error));
				}
			});	
		}
	}));	
};