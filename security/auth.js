var check = require("validator").check,
	sanitize = require("validator").sanitize;

var validateUserMessage = {
	"password_small": "The minimum length of the password field is 5",
	"username_small": "The minimum length of the username field is 3",
	"email_invalid": "The email address is not valid",
	"password_notsame": "The passwords are not the same"
}

module.exports = {
	"validateUser": [
		function _validateUser(req, res, next) {
			check(req.body.password, "password_small").len(5);
			check(req.body.username, "username_small").len(3);
			check(req.body.email, "email_invalid").isEmail();
			check(req.body.password, "password_notsame").equals(req.body.password_confirm);
		},
		function _handleUserError(req, res, next, err) {
			console.log("test");
			req.flash(err.message, validateUserMessage[err.message]); 
			res.redirect("back");
		}
	]
}