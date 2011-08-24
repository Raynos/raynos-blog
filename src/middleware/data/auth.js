var	Trait = require("traits").Trait,
	uuid = require("node-uuid"),
	Base = require("./base.js"),
	crypto = require("crypto");

var Auth = Object.create(Object.prototype, Trait.compose(Trait({
	"_base_url": Base._couch_url + "/_users",
	"_get": function _get(id, cb) {
		// check if in cache
		if (id !== null && this._cache[id]) {
			cb(null, null, this._cloneDoc(this._cache[id]));
			return;
		}

		this._request({
			"uri": this._base_url + "/org.couchdb.user:" + id
		}, this._db_error((function _get(err, res, body) {
			if (body.error) {
				cb(new Error(body.error), res, body);
			} else {
				this._cache[id] = this._cloneDoc(body);
				cb(null, res, body);
			}
		}).bind(this)));
	},
	"_createHash": function _createHash(salt, password) {
		var sha = crypto.createHash("sha1");
		sha.update(password);
		sha.update(salt);
		return sha.digest("hex");
	},
	"_create": function _create(data, cb) {
		var salt = new Buffer(uuid()).toHex();
		var hash = this.createHash(salt, data.password);

		var user = {
			"_id": "org.couchdb.user:" + data.username,
			"type": "user",
			"name": data.username,
			"email": data.email,
			"roles": [],
			"password_sha": hash,
			"salt": salt
		};

		this._request({
			"uri": this._base_url + "/" + user._id,
			"json": user,
			"method": "PUT"
		}, this._db_error(cb));
	},
	"createUser": function _createUser(req, res, next) {
		this._create(req.body, this._error(next, function _create(err, res, body) {
			if (body.ok === true) {
				next();
			}
		}));
	},
	"getUser": function _getUser(req, res, next) {
		this._get(req.body.username, this._error(next, function _get(err, res, body) {
			if (err && err.message === "not_found") {
				req.user = err.message;
				next();
			} else if (body._id !== undefined) {
				req.user = body;
				next();
			} 
		}));
	}
}), Trait(Base)));

module.exports = Auth;

Auth.on("start", function _start() {
	Auth.emit("loaded");	
});