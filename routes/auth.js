module.exports = function(app) {
	app.get("/signup/", function(req, res) {
		res.render("auth/signup")
	});

	app.post("/signup/", function(req, res) {
		console.log(req.body);
	});
}
