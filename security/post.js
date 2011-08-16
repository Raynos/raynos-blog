module.exports = {
	"requireLogin": function _requireLogin(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/login/' + encodeURIComponent(req.url));
		}
	},
	"checkId": function _checkId(req, res, next) {
		if (isNaN(req.postId)) {
			next(new Error("id is NaN"));
		} else {
			next();
		}
	},
	"validatePost": function _validatePost(req, res, next) {
		var valid = true;
		if (req.body.content === undefined || req.body.content.length === 0) {
			req.flash("error", "body content is not set");
			valid = false;
		} 

		if (req.body.title === undefined || req.body.title.length === 0) {
			req.flash("error", "body title is not set");
			valid = false;
		}

		if (valid) {
			next();
		} else {
			res.redirect("back");
		}
	}
};