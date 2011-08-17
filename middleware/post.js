var validate = require("./common.js").validate,
	Trait = require("traits").Trait;


var flashMessages = {
	"content": "body content is not set",
	"title": "body title is not set"
}

module.exports = function _createMiddleware() {
	return Trait.create(Object.prototype, Trait({
		"validate": function _validate(req, res, next) {
			req.validator = function(defaults) {
				if (defaults === undefined || defaults === true) {
					return validate({
						"defaultInvalid": res,
						"defaultError": {
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
		"requireLogin": function _requireLogin(req, res, next) {
			if (req.session.user) {
				next();
			} else {
				res.redirect('/login/' + encodeURIComponent(req.url));
			}
		},
		"checkId": function _checkId(req, res, next) {
			var id = parseInt(req.params.postId, 10);
			req.validator(false).on("error", function _404(msg) {
				next(new Error(msg));
			}).on("valid", function _invalid() {
				req.postId = id;
				next();
			}).run(function _checkId() {
				check(id, 'id is not a number').isInt();
			});
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
	}));	
};