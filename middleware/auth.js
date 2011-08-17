var validate = require("./common.js").validate,
	Trait = require("traits").Trait;

var flashMessages = {
	"password_small": "The minimum length of the password field is 5",
	"username_small": "The minimum length of the username field is 3",
	"username_invalid": "The username needs to be alphanumeric",
	"email_invalid": "The email address is not valid",
	"password_notsame": "The passwords are not the same",
	"username_incorrect": "The username and password are incorrect",
	"username_found": "The username is already taken"
}

module.exports = function _createMiddleware(model) {
	return Trait.create(Object.prototype, Trait({
		"_validateInput": function _validateInput(check, req) {
			check(req.body.password, "password_small").len(5);
			check(req.body.username, "username_small").len(3);
		},
		"validateSignup": function _validateUser(req, res, next) {
			req.validator().run((function _validateUsers(check) {
				this._validateInput(check, req);
				check(req.body.username, "username_invalid").isAlphanumeric();
				check(req.body.email, "email_invalid").isEmail();
				check(req.body.password, "password_notsame").equals(req.body.password_confirm);	
			}).bind(this), next);	
		},
		"validate": function _validate(req, res, next) {
			req.validator = function() {
				return validate({
					"defaultInvalid": res,
					"defaultError": {
						"req": req,
						"messages": flashMessages
					}
				});
			}
			next();
		},
		"validateLogin": function _validateLogin(req, res, next) {
			req.validator().run((function _validateLogin(check) {
				this._validateInput(check, req);
			}).bind(this), next);
		},
		"createUser": function _createUser(req, res, next) {
			model.create(req.body, function _create(err, res, body) {
				if (err) {
					next(err)
				} else if (body.ok === true) {
					next();
				} else {
					next(new Error(body.error));
				}
			});
		},
		"getUser": function _getUser(req, res, next) {
			model.get(req.body.username, function _get(err, doc) {
				if (err && err.message === "not_found") {
					req.doc = err.message;
					next();
				} else if (err) {
					next(err);
				} else {
					req.doc = doc;
					next();
				}
			});
		},
		"validateHash": function _validateHash(req, res, next) {
			req.validator().on("valid", function _hashValid() {
				next();
			}).run(function _validateHash(check) {
				var hash = model.createHash(req.doc.salt, req.body.password);
				check(hash, "username_incorrect").equals(req.doc.password_sha);
			});
		},
		"checkUserExistance": function _checkUserExists(expectToExist) {
			return function _checkUserExists(req, res, next) {
				req.validator().run(function _checkUser(check) {
					if (expectToExist) {
						check(req.doc, "username_incorrect").notContains("not_found");
					} else {
						check(req.doc, "username_found").contains("not_found");
					}
				}, next);
			};
		}
	}));
};