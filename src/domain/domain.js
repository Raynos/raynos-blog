var after = require("after");

var Domain = {
	get: function _get(id, cb) {
		var that = this;

		this.Model.get(this.prefix + id, function (err, data) {
			if (err) return cb(err, null);
			cb(err, that.make(data));
		})
	},
	all: function _all(cb) {
		var that = this;

		this.Model.all(function (err, data) {
			if (err) return cb(err);
			var rows = data.rows;

			cb(null, rows.map(function (item) {
				return item.doc;
			}).sort(function (a, b) {
				return +a.id < +b.id ? 1 : -1;
			}));
		});
	}
}

module.exports = Domain;