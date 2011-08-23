var EventEmitter = require("events").EventEmitter.prototype,
	Trait = require("traits").Trait;

module.exports = Object.create(Object.prototype, Trait.compose(Trait({
	"_request": require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	"_couch_url": "http://raynos.iriscouch.com",
	// cache individual users
	"_cache": {},
	// error wrapper to log all errors
	"_error": function _error (f) {
		return function _errorProxy(err, res, body) {
			console.log(arguments);
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
	}
}), Trait(EventEmitter)));