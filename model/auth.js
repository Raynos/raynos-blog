var request = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	Trait = require("traits").Trait,
	EventEmitter = require("events").EventEmitter.prototype,
	url = require("url"),
	sha = require("crypto").createHash('sha1');

var User = Object.create(EventEmitter, Trait({
	// cache individual users
	"_cache": {},
	"_base_url": "http://raynos.iriscouch.com/raynos",
	// error wrapper to log all errors
	"_error": function _error (f) {
		return function _errorProxy(err, res, body) {
			if (err) {
				console.log("error in blog");
				console.log(err);
			} else {
				f(err, res, body);
			}
		};	
	},
	"create": function _create(data, cb) {
		
	}
}));
User.on("start", function() {
	User.emit("loaded");	
});


module.exports = User;