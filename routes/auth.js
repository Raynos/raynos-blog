module.exports = function(app, model) {
	app.get("/signup", function(req, res) {
		res.render("auth/signup")
	});

	app.post("/signup", function(req, res) {
		// validate
		if (res.body.password !== res.body.password_confirm) {
			
		}

		var data = {
			email: res.body.email,
			password: res.body.password,
			username: res.body.username,
		}
	});

	app.get("/login/:redir?", function(req, res) {
		res.render("auth/login", {
			"redir": req.params.redir
		});
	});

	app.post("/login", function(req, res) {
		
	});
}
