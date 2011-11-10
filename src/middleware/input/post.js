var pd = require("pd"),
	Base = require("./base.js");

module.exports = pd.make(Base, {
	"_flashMessages": {
		"content": "body content is not set",
		"title": "body title is not set"
	},
	"cleanseUrl": function _cleanseUrl(req, res, next) {
		if (req.url.charAt(req.url.length - 1) === "?") {
			req.url = req.url.substring(0, req.url.length - 1);
		}
		next();
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
	"validatePost": function _validatePost(req, res, next) {
		req.validator().run(function _validatePost(check) {
			check(req.body.content, "content").len(1).notEmpty();
			check(req.body.title, "title").len(1).notEmpty();
		}, next);
	},
	"checkPostExistance": function _checkPostExistance(req, res, next) {
		req.validator({
			"errorNextOnError": next
		}).run(function _checkExistance(check) {
			check(req.post, "post does not exist").isDefined();
		}, next);
	}
});