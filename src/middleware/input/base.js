var Validator = require("validator").Validator.prototype,
	Filter = require("validator").Filter.prototype,
	pd = require("pd"),
	EventEmitter = require("events").EventEmitter.prototype;

module.exports = {
	"validate": function _validate(req, res, next) {
		req.validator = (function(defaults) {
			if (!this._flashMessages) {
				console.log(this);
			}
			if (defaults === undefined || defaults === true) {
				return this._validate({
					"redirectOnInvalid": res,
					"flashOnError": {
						"req": req,
						"messages": this._flashMessages
					}
				});	
			} else if (defaults === false) {	
				return this._validate();
			} else {
				return this._validate(defaults);
			}
		}).bind(module.exports);
		next();
	},
	"_validate": function _validate(opts) {
		var v = pd.extend(
			{
				"run": function(f, next) {
					this._valid = true;
					f(this.check.bind(this));
					if (this._valid) {
						this.emit("valid", this.sanitize.bind(this));
						if (next) {
							next();	
						}
					} else {
						this.emit("invalid");
					}
					return this;
				},
				"error": function(msg) {
					this._valid = false;
					this.emit("error", msg);
				},
				"isDefined": function() {
					if (this.str == undefined) {
						return this.error(this.msg || 'Is not defined');
					}
					return this;
				},
				"isNotDefined": function() {
					if (this.str != undefined) {
						return this.error(this.msg || 'Is defined');
					}
					return this;
				},
				"notEquals": function(val) {
					if (this.str == val) {
						return this.error(this.msg || 'Is equal');
					}
					return this;
				},
				"isUrlSegment": function(val) {
					var _str = this.str;
					this.str = "http://www.google.com" + this.str;
					this.isUrl();
					this.str = _str;
					return this;
				},
				"any": function() {
					var commands = Array.prototype.slice.call(arguments);
					var _error = this.error;
					var counter = 0;
					this.error = function _error() {
						counter++;
					};
					commands.forEach((function _forEach(v) {
						if (typeof v === "string") {
							this[v]();
						} else if (typeof v === "function") {
							v(this.check.bind(this));
						}
					}).bind(this));
					this.error = _error;
					if (counter === commands.length) {
						return this.error(this.msg || 'A check failed');
					} 
					return this;
				},
			},
			Validator,
			Filter,
			EventEmitter
		);

		if (opts.redirectOnInvalid) {
			var res = opts.redirectOnInvalid;

			v.on("invalid", function _invalid() {
				res.redirect("back");
			});
		}
				 
		if (opts.errorNextOnError) {
			var next = opts.errorNextOnError;

			v.on("error", function _error(msg) {
				next(new Error(msg));
			});
		}

		if (opts.flashOnError) {
			var req = opts.flashOnError.req,
				messages = opts.flashOnError.messages;

			v.on("error", function _error(msg) {
				req.flash(msg, messages[msg]);
			});
		}

		return v;
	}
};