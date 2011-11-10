module.exports = function _route(app, middle) {

	app.get("/signup", middle.output.renderSignup);

	app.get("/login/:redir?", [
		middle.input.validate,
		middle.input.sanitizeRedir,
		middle.output.renderLogin
	]);

	app.post("/signup", [
		middle.input.validate,
		middle.input.validateSignup, 
		middle.data.createUser,
		middle.output.redirectHome
	]);

	app.post("/login", [
		middle.input.validate,
		middle.input.validateLogin, 
		middle.data.validateUser,
		middle.auth.storeUser,
		middle.output.redirectRedir
	]);
};
