var check = require("validator").check,
	sanitize = require("validator").sanitize;

var validatePostMessages = {
	"content": "body content is not set",
	"title": "body title is not set"
}

module.exports = {
	"requireLogin": function _requireLogin(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/login/' + encodeURIComponent(req.url));
		}
	},
	"checkId": function _checkId(req, res, next) {
		var id = sanitize(req.params.postId).toInt();
		check(id, 'id is not a number').isInt();
		req.postId = id;
		next();
	},
	"validatePost": [
		function _validatePost(req, res, next) {
			check(req.body.content, "content").isString().notEmpty();
			check(req.body.title, "title").isString().notEmpty();
			next();
		},
		function _handleValidationError(req, res, next, err) {
			req.flash(err.message, validatePostMessages[err.message]);
			res.redirect("back");
		}
	]
};