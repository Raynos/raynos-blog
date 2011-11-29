var UserModel = require("../data/user.js"),
	Validator = require("../util.js").Validator,
	Domain = require("./domain.js"),
	uuid = require("node-uuid"),
	crypto = require("crypto"),
	pd = require("pd");

function createHash(salt, password) {
    var sha = crypto.createHash("sha1");
    sha.update(password);
    sha.update(salt);
    return sha.digest("hex");
}

var User = UserModel.make(Domain, {
	constructor: function _constructor(obj) {
		pd.extend(this, obj)
		this.id = this._id.split(":")[1];	
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
	construct: function _construct(user, cb) {
		var salt = new Buffer(uuid(), "hex").toString();
		var hash = createHash(salt, user.password);

		var obj = {
			_id: this.prefix + user.username,
			type: "user",
			name: user.username,
			id: user.username,
			email: user.email,
			roles: [],
			password_sha: hash,
			salt: salt
		};

		this.create(obj, handleCreate);

		function handleCreate(err, user) {
			if (err && err.error === "conflict") {
				return cb(["The user name is already taken"]);
			} else if (err) {
				return cb([err]);
			}
			cb(null, user);
		}
	},
	Model: UserModel
});

module.exports = User;