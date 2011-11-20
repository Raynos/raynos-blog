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
				
			var next = after(rows.length, function _next() {
				var items = [].slice.call(arguments).sort(function (a, b) {
					return +a.id > +b.id;
				});
				
				cb(null, items);
			});

			rows.forEach(function (row) {
				that.Model.get(row.id, function (err, item) {
					next(item);
				});	
			});
		});
	}
}

module.exports = Domain;