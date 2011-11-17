var Validator = require("validator").Validator.prototype,
	pd = require("pd");

module.exports = {
	Validator: pd.make(Validator, {
		error: function (e) {
			if (!this.errors) {
				this.errors = [];
			}
			this.errors.push(e);
		}
	})
};