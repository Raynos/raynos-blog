module.exports = function _route(app, model, view, secure) {
	app.get("/signup", function _signUpView(req, res) {
		res.render("auth/signup", {
			"flash": req.flash()
		});
	});

	app.post("/signup", secure.validateUser, function _signUpCreate(req, res) {
		model.create(req.body, function _create() {
			
		});
	});

	app.get("/login/:redir?", function _loginView(req, res) {
		res.render("auth/login", {
			"redir": req.params.redir
		});
	});

	app.post("/login", function _loginPost(req, res) {
		
	});
}
