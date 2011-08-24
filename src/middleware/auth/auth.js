var Trait = require("traits").Trait;

module.exports = {
	"storeUser": function _storeUser(req, res, next) {
		req.session.user = req.user;
		next();
	}
};