var nano = require("nano")
	pd = require("pd"),
	error = require("error"),
	EventEmitter = require("events").EventEmitter.prototype;

var Model = pd.make(EventEmitter, {
	get: function _get(id, cb) {
        this.nano.get(id, 
            this.makeWhitelistCallback("get", id, cb)
        );
    },
    all: function _all(cb) {
    	this.nano.list({
            "include_docs": true
        },this.makeWhitelistCallback("all", null, cb));
    },
    insert: function _create(json, cb) {
        this.nano.insert(json, json._id, 
            this.makeWhitelistCallback("insert", json, cb)
        );
    },
    delete: function _delete(name, cb) {
        var that = this;
        this.get(name, function _getRev(err, body) {
            that.nano.destroy(name, body._rev, 
                that.makeWhitelistCallback("delete", name, cb)
            );
        });
    },
	constructor: function _constructor() {
		this._events = [];
		this.nano = nano("http://" + process.env.COUCH_USER + ":" +
			process.env.COUCH_PWD + "@raynos.iriscouch.com");
	},
	makeWhitelistCallback: function _makeWhitelistCallback(method, thing, cb) {
	    var that = this;

	    return error.whitelist(function _errors(err) {
	        if (err.syscall === "getaddrinfo") {
	            that[method](thing, cb);
	        } else if (that.whitelistMap[method].indexOf(err.error) !== -1) {
	            return true;
	        } else {
	            return false;
	        }
	    }, cb);
	},
	start: function _start() {
		this.emit("loaded");
	},
    whitelistMap: {
    	"all": [],
        "get": ["not_found"],
        "insert": ["conflict"],
        "delete": []
    }
});

Model.constructor();

module.exports = Model;