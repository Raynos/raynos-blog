var UserModel = require("../data/user.js"),
	Validator = require("../util.js").Validator,
	uuid = require("node-uuid"),
	crypto = require("crypto"),
	pd = require("pd");

var prefix = "org.couchdb.user:"

function createHash(salt, password) {
    var sha = crypto.createHash("sha1");
    sha.update(password);
    sha.update(salt);
    return sha.digest("hex");
}

var User = {
	get: function _get(id, cb) {
		UserModel.get(prefix + id, function (err, user) {
			if (err && err.error === "not_found") {
				return cb(err, null);
			}
			cb(err, User.make(user));
		});
	},
	make: function _make(obj) {
		var user = Object.create(User);
		pd.extend(user, obj);
		user.id = user._id.split(":")[1];
		return user;
	},
	validatePassword: function _validate(password) {
		var hash = createHash(this.salt, password);
		if (hash === this.password_sha) {
			return;
		}
		return "Login failed";
	},
	validate: function _validate(user) {
		var v = Object.create(Validator);
		v.check(user.password, "The minimum password length is 5").len(5);
		v.check(user.username, "The minimum username length is 3").len(3);
		v.check(user.username, 
			"The username needs to be alphanumeric").isAlphanumeric();
		v.check(user.email, "The email is invalid").isEmail();
		v.check(user.password, 
			"passwords are not the same").equals(user.password_confirm);
		if (v.errors && v.errors.length) {
			return v.errors;
		}
	},
	create: function _create(user, cb) {
		var salt = new Buffer(uuid(), "hex").toString();
		var hash = createHash(salt, user.password);

		var obj = {
			_id: prefix + user.username,
			type: "user",
			name: user.username,
			email: user.email,
			roles: [],
			password_sha: hash,
			salt: salt
		};

		UserModel.insert(obj, function _cb(err, user) {
			if (err && err.error === "conflict") {
				return cb(["The user name is already taken"]);
			}
			UserModel.get(user.id, function (err, user) {
				cb(null, User.make(user));
			});
		});
	}
};

module.exports = User;