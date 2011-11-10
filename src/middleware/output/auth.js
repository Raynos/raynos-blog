var pd = require("pd"),
	Base = require("./base.js");

module.exports = pd.make(Base, {
	"renderSignup": function _signUpView(req, res) {
		res.render("auth/signup", req.flash());
	},
	"renderLogin": function _loginView(req, res) {
		res.render("auth/login", this._flash(req.flash(), {
			"redir": req.params.redir
		}));
	},
	"redirectHome": function _redirectHome(req, res) {
		res.redirect("/");
	},
	"redirectRedir": function _redirectRedir(req, res) {
		res.redirect(req.body.redir || "/");
	}
});