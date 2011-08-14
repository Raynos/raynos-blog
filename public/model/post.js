var request = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	url = require("url"),
	uuid = require("node-uuid");

var Post = {
	"_cache": {},
	"_base_url": "http://raynos.iriscouch.com/raynos",
	"_error": function _error (f) {
		return function _errorProxy(err, res, body) {
			if (err) {
				console.log("error in blog");
				console.log(err);
			} else {
				f(err, res, body);
			}
		};	
	},
	"_cloneRows": function _cloneRows(rows) {
		return rows.map(function _cloneRows(row) { 
			var o = { 
				value: {}
			};
			Object.keys(row.value).forEach(function _cloneValues(key) {
				o.value[key] = row.value[key];
			});
			return o;
		});
	},
	"get": function _get(id, cb) {
		if (typeof id === "function") {
			cb = id; 
			id = null;
		}

		if (id !== null && this._cache[id]) {
			cb(null, this._cloneRows(this._cache[id]));
			return;
		};

		var uri = url.parse(this._base_url)
		uri.pathname += "/_design/posts/_view/all";
		uri.query = {
			"descending": JSON.stringify(true)
		};
		if (id) {
			uri.query.startkey = uri.query.endkey = JSON.stringify(id);
		}

		request({
			"uri": url.format(uri)
		}, this._error((function _callback(err, resp, body) {
			var rows = JSON.parse(body).rows;
			if (!rows || rows.length === 0) {
				cb(new Error("no results"), []);
			} else {
				if (id) {
					this._cache[id] = this._cloneRows(rows);
				}
				cb(null, rows);
			}
		}).bind(this)));
	},
	"save": function _save(data, cb) {
		this.get(data.id, (function _saveData(err, rows) {
			delete this._cache[data.id];

			Object.keys(data).forEach(function _cloneOverValues(key) {
				rows[0].value[key] = data[key];
			});

			request({
				"uri": this._base_url + "/" + rows[0].value._id,
				"json": rows[0].value,
				"method": "PUT"
			}, this._error(cb));
		}).bind(this));
	},
	"create": function _create(data, cb) {
		data._id = uuid();

		request({
			"uri": this._base_url + "/" + data._id,
			"json": data,
			"method": "PUT"
		}, this._error(cb));
	},
	"destroy": function _destroy(id, cb) {
		this.get(id, (function _destroyDoc(err, rows) {
			delete this._cache[id];
			var uri = url.parse(this._base_url);
			uri.pathname += "/" + rows[0].value._id;
			uri.query = {
				"rev": rows[0].value._rev
			};

			request({
				"url": url.format(uri),
				"method": "DELETE"
			}, this._error(cb));	
		}).bind(this));
	}
};

// Create all view
request({
	"url": Post._base_url + "/_design/posts"
}, Post._error(function _callback(err, resp, body) {
	// If it does not exist create the view
	if (JSON.parse(body).error === "not_found") {
		var view = {
			"all": {
				"map": "function(d) { if (d.type === 'post') emit(d.id, d); }"
			}
		};

		request({
			"url": Post._base_url + "/_design/posts",
			"method": "PUT",
			"json": {
				"_id": "_design/posts",
				"views": view
			}
		}, Post._error(function _noop() {}));
	}
}));

module.exports = Post;