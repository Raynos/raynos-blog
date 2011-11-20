var everyauth = require("everyauth"),
	User = require("../domain/user.js");

function initEveryAuth(app) {
	everyauth.everymodule
		.findUserById(function (id, cb) {
			User.get(id, function (err, user) {
				cb(err, user);
			});
		});

	everyauth.password
		.getLoginPath("/login")
		.postLoginPath("/login")
		.loginFormFieldName("username")
		.passwordFormFieldName("password")
		.loginView("auth/login")
		.authenticate(function (login, password) {
			var errors = [];
			if (!login) errors.push("Missing login");
			if (!password) errors.push("Missing password");
			if (errors.length) return errors;
			var promise = this.Promise();
			User.get(login, function (err, user) {
				if (err) return promise.fulfill([err]);
				err = user.validatePassword(password);
				if (err) return promise.fulfill([err]);
				promise.fulfill(user);
			});
			return promise;
		})
		.loginSuccessRedirect("/")

		.getRegisterPath("/register")
		.postRegisterPath("/register")
		.registerView("auth/register")
		.extractExtraRegistrationParams(function (req) {
			return {
				username: req.body.username,
				password_confirm: req.body.password_confirm,
				email: req.body.email
			};
		})
		.validateRegistration( function (user) {
			var errors = User.validate(user);
			if (errors) return errors;
			// everyauth is rage
			// it asks for an empty promise, give it an empty promise
			var promise = this.Promise();
			promise.fulfill([]);
			return promise;
		})
		.registerUser(function (user) {
			var promise = this.Promise();
			User.create(user, function (err, user) {
				if (err) return promise.fulfill(err);
				promise.fulfill(user);
			});
			return promise;
		})
		.registerSuccessRedirect("/login");
};

module.exports = initEveryAuth;