var Trait = require("traits").Trait;

module.exports = {
	"beRaynos": function _beRaynos(req, res, next) {
		if (req.session.user.name === "Raynos") {
			next();
		} else {
			next(new Error("Your not Raynos"));
		}
	},	
	"requireLogin": function _requireLogin(req, res, next) {
		if (req.session.user) {
			next();
		} else {
			res.redirect('/login/' + encodeURIComponent(req.url));
		}
	}
};