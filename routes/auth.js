var crypto = require("crypto");

module.exports = function _route(app, model, view, middle) {
	var m;
	
	app.get("/signup", function _signUpView(req, res) {
		res.render("auth/signup", req.flash());
	});

	app.get("/login/:redir?", function _loginView(req, res) {
		res.render("auth/login", view.flash(req.flash(), {
			"redir": req.params.redir
		}));
	});

	m = [
		middle.validate, 
		middle.validateSignup, 
		middle.getUser, 
		middle.checkUserExistance(false), 
		middle.createUser
	];
	app.post("/signup", m, function _success(req, res) {
		res.redirect("/");	
	});

	m = [
		middle.validate, 
		middle.validateLogin, 
		middle.getUser, 
		middle.checkUserExistance(true),
		middle.validateHash
	];
	app.post("/login", m, function _success(req, res) {
		req.session.user = req.doc;
		res.redirect(req.body.redir || "/");
	});
}
