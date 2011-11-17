var nano = require("nano")
	pd = require("pd"),
	EventEmitter = require("events").EventEmitter.prototype;

var Model = pd.make(EventEmitter, {
	constructor: function () {
		this.nano = nano("http://" + process.env.COUCH_USER + ":" +
			process.env.COUCH_PWD + "@raynos.iriscouch.com");
	}
});

module.exports = Model;