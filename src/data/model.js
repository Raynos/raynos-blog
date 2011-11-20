var nano = require("nano")
	pd = require("pd"),
	EventEmitter = require("events").EventEmitter.prototype;

var Model = pd.make(EventEmitter, {
	constructor: function () {
		this._events = [];
		this.nano = nano("http://" + process.env.COUCH_USER + ":" +
			process.env.COUCH_PWD + "@raynos.iriscouch.com");
	},
	start: function () {
		this.emit("loaded");
	}
});

Model.constructor();

module.exports = Model;