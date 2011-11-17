var everyauth = require("everyauth"),
	User = require("../domain/user.js");

function initEveryAuth(app) {
	everyauth.debug = true;

	everyauth.everymodule
		.findUserById(function (id, cb) {
			User.get(id, function (err, user) {
				cb(err, user);
			});
		});

	everyauth.password
		.getLoginPath("/login")
		.postLoginPath("/login")
		.loginView("auth/login.dust")
		.authenticate(function (login, password) {
			var errors = [];
			if (!login) errors.push("Missing login");
			if (!password) errors.push("Missing password");
			if (errors.length) return errors;
			var promise = this.Promise();
			User.get(login, function (err, user) {
				if (err) promise.fulfill([err]);
				err = user.validatePassword(password);
				if (err) promise.fulfill([err]);
				promise.fulfill(user);
			});
			return promise;
		})
		.loginSuccessRedirect("/")

		.getRegisterPath("/register")
		.postRegisterPath("/register")
		.registerView("auth/register.dust")
		.validateRegistration( function (user) {
			var errors = User.validate(user);
			if (errors) return errors;
		})
		.registerUser(function (user) {
			var promise = this.Promise();
			User.create(user, function (err, user) {
				if (err) promise.fulfill(err);
				promise.fulfill(user);
			});
			return promise();
		})
		.registerSuccessRedirect("/login");
};

module.exports = initEveryAuth;