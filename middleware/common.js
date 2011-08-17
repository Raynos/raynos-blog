var Validator = require("validator").Validator.prototype,
	Filter = require("validator").Filter.prototype,
	Trait = require("traits").Trait,
	EventEmitter = require("events").EventEmitter.prototype;

exports.validate = function(opts) {
	var v = Object.create(Object.prototype, Trait.override(
		Trait({
			"run": function(f, next) {
				this._valid = true;
				f(this.check.bind(this));
				console.log("in run");
				console.log(this);
				if (this._valid) {
					if (next) {
						next();	
					} 
					this.emit("valid", this.sanitize.bind(this));	
				} else {
					this.emit("invalid");
				}
			},
			"error": function(msg) {
				this._valid = false;
				console.log("in error");
				console.log(this);
				this.emit("error", msg);
			}
		}),
		Trait(Validator),
		Trait(Filter),
		Trait(EventEmitter)
	));

	if (opts.defaultInvalid) {
		var res = opts.defaultInvalid;

		v.on("invalid", function _invalid() {
			res.redirect("back");
		});
	}

	if (opts.defaultError) {
		var req = opts.defaultError.req,
			messages = opts.defaultError.messages;

		v.on("error", function _error(msg) {
			console.log("WTF");
			req.flash(msg, messages[msg]);
		});
	}

	return v;
};