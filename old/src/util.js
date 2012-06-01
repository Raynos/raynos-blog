var Validator = require("validator").Validator.prototype,
	pd = require("pd");

module.exports = {
	Validator: pd.make(Validator, {
		error: function _error(e) {
			if (!this.errors) {
				this.errors = [];
			}
			this.errors.push(e);
		}
	})
};