var after = require("after");

var Domain = {
	get: function _get(id, cb) {
		var that = this;

		this.Model.get(id, handleGet);

		function handleGet(err, data) {
			if (err) return cb(err, null);
			cb(err, that.beget(data));
		}
	},
	all: function _all(cb) {
		var that = this;

		this.Model.all(handleAll);

		function handleAll(err, data) {
			if (err) return cb(err);
			var rows = data.rows;

			cb(null, rows.map(mapDocuments).sort(sortDocuments));
		}

		function mapDocuments(item) {
			return that.beget(item.doc);
		}

		function sortDocuments(a, b) {
			return +a.id < +b.id ? 1 : -1;
		}
	},
	nextId: function _nextId(cb) {
		this.Model.all(handleAll);

		function handleAll(err, data) {
			if (err) return cb(err);

			var rows = data.rows;
			
			var id = rows.reduce(function (memo, item) {
				var id = +(item.id.split(":")[1]);
				return id > memo ? id : memo;
			}, 0);
			id++;

			cb(null, id);
		}
	},
	create: function _create(obj, cb) {
		var that = this;

		this.Model.create(obj, handleCreate)

		function handleCreate(err, data) {
			if (err) return cb(err);
			that.get(obj.id, cb);
		}
	},
	update: function _update(id, obj, cb) {
		var that = this;

		function handleUpdate(err, data) {
			if (err) return cb(err);
			that.get(id, cb);
		}

		that.Model.update(id, obj, handleUpdate);
	}
}

module.exports = Domain;