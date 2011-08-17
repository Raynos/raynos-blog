var request = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	Trait = require("traits").Trait,
	EventEmitter = require("events").EventEmitter.prototype,
	uuid = require("node-uuid"),
	url = require("url"),
	crypto = require("crypto");

var User = Object.create(EventEmitter, Trait({
	// cache individual users
	"_cache": {},
	"_base_url": "http://raynos.iriscouch.com/_users",
	// error wrapper to log all errors
	"_error": function _error (f) {
		return function _errorProxy(err, res, body) {
			if (err) {
				console.log("error - post");
				console.log(err);
			} else if (typeof body === "string") {
				body = JSON.parse(body);
			}
			if (body.error) {
				console.log("error in body - post");
				console.log(body.error);
			}
			f(err, res, body);
		};	
	},
	// clone the rows object for use with the cache
	// if we don't clone it then we're mutating a single instance all the time.
	"_cloneRows": function _cloneRows(rows) {
		return rows.map(function _cloneRows(row) { 
			return { 
				value: this._cloneDoc(row.value)
			};
		});
	},
	"_cloneDoc": function _cloneDoc(doc) {
		var o = {};
		Object.keys(doc).forEach(function _cloneValues(key) {
			o[key] = doc[key];
		});
		return o;
	},
	"get": function _get(id, cb) {
		// check if in cache
		if (id !== null && this._cache[id]) {
			cb(null, null, this._cloneDoc(this._cache[id]));
			return;
		};	

		request({
			"uri": this._base_url + "/org.couchdb.user:" + id
		}, this._error((function _get(err, res, body) {
			if (body.error) {
				cb(new Error(body.error), res, body);
			} else {
				this._cache[id] = this._cloneDoc(body);
				cb(null, res, body);
			}
		}).bind(this)));
	},
	"createHash": function _createHash(salt, password) {
		var sha = crypto.createHash("sha1");
		sha.update(password);
		sha.update(salt);
		return sha.digest("hex");
	},
	"create": function _create(data, cb) {
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

		request({
			"uri": this._base_url + "/" + user._id,
			"json": user,
			"method": "PUT"
		}, this._error(cb));
	}
}));

User.on("start", function _start() {
	User.emit("loaded");	
});


module.exports = User;