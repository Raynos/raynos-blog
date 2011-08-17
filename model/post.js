var request = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	Trait = require("traits").Trait,
	EventEmitter = require("events").EventEmitter.prototype,
	url = require("url"),
	uuid = require("node-uuid");

var Post = Object.create(EventEmitter, Trait({
	// cache individual posts
	"_cache": {},
	"_base_url": "http://raynos.iriscouch.com/raynos",
	// error wrapper to log all errors
	"_error": function _error (f) {
		return function _errorProxy(err, res, body) {
			if (err) {
				console.log("error - post");
				console.log(err);
			} else if (typeof body === "string" && body !== "") {
				body = JSON.parse(body);
			}
			if (body.error) {
				console.log("error in body - post");
				console.log(body.error);
			}
			f(err, res, body);
		};	
	},
	// clone the rows object for use with the cache
	// if we don't clone it then we're mutating a single instance all the time.
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
	"_cloneDoc": function _cloneDoc(doc) {
		var o = {};
		Object.keys(doc).forEach(function _cloneValues(key) {
			o[key] = doc[key];
		});
		return o;
	},
	// get a document with the id [id] or get all posts if no id is passed
	"get": function _get(id, cb) {
		// support get(function() { ... });
		if (typeof id === "function") {
			cb = id; 
			id = null;
		}

		// check if in cache
		if (id !== null && this._cache[id]) {
			cb(null, null, this._cloneDoc(this._cache[id]));
			return;
		};
		// point url at view all on couch
		var uri = url.parse(this._base_url)
		uri.pathname += "/_design/posts/_view/all";
		uri.query = {
			"descending": JSON.stringify(true)
		};
		// if id set startkey & endkey to filter view down to single value
		if (id !== null) {
			uri.query.startkey = uri.query.endkey = JSON.stringify(id);
		}

		// request documents
		request({
			"uri": url.format(uri)
		}, this._error((function _callback(err, resp, body) {
			// if no rows throw an error
			if (body.rows === undefined || (body.rows.length === 0 && id)) {
				cb(new Error("not_found"), resp, body);
			} else {
				// store in cache if needed
				if (id) {
					this._cache[id] = this._cloneDoc(body.rows[0].value);
					cb(null, resp, body.rows[0].value);
				} else {
					cb(null, resp, body);	
				}
				
			}
		}).bind(this)));
	},
	// save document
	"save": function _save(post, cb) {
		// doc changed so empty it from cache
		delete this._cache[post.id];

		// PUT document in couch
		request({
			"uri": this._base_url + "/" + post._id,
			"json": post,
			"method": "PUT"
		}, this._error(function _savePost(err, res, body) {
			if (body) {
				body.id = post.id;
				body.title = post.title;
			}
			cb(err, res, body);
		}));
	},
	// create a document
	"create": function _create(data, cb) {
		var post = {
			"content": data.content,
			"title": data.title,
			"datetime": Date.now(),
			"type": "post"
		}

		this.get((function _get(err, res, body) {
			// get highest id and make the new id one higher.
			var id = body.rows.map(function _pluckId(v) {
				return v.value.id;
			}).reduce(function _findMaxId(prev, curr) {
				return prev < curr ? curr : prev;
			}, 0);

			post.id = ++id;

			post._id = uuid();

			request({
				"uri": this._base_url + "/" + post._id,
				"json": post,
				"method": "PUT"
			}, this._error(function _putPost(err, res, body) {
				if (body) {
					body.id = post.id;
					body.title = post.title;
				} 
				cb(err, res, body);
			}));
		}).bind(this));
	},
	// destroy document
	"destroy": function _destroy(post, cb) {
		delete this._cache[post.id];
		// send DELETE to couch for doc & rev.
		var uri = url.parse(this._base_url);
		uri.pathname += "/" + post._id;
		uri.query = {
			"rev": post._rev
		};

		request({
			"url": url.format(uri),
			"json": true,
			"method": "DELETE"
		}, this._error(cb));	
	}
}));

// Create all view
request({
	"url": Post._base_url + "/_design/posts"
}, Post._error(function _callback(err, resp, body) {
	// If it does not exist create the view
	if (body.error === "not_found") {
		// The all view returns all posts
		var view = {
			"all": {
				"map": "function(d) { if (d.type === 'post') emit(d.id, d); }"
			}
		};

		// put view in couch
		request({
			"url": Post._base_url + "/_design/posts",
			"method": "PUT",
			"json": {
				"_id": "_design/posts",
				"views": view
			}
		}, Post._error(function _emitReady(err, data) {
			if (!err) {
				Post.emit("loaded");
			}
		}));
	} else {
		Post.emit("loaded");
	}
}));

module.exports = Post;