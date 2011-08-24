var	Trait = require("traits").Trait,
	url = require("url"),
	Base = require("./base.js"),
	uuid = require("node-uuid");

var Post = Object.create(Object.prototype, Trait.compose(Trait({
	"_base_url": Base._couch_url + "/raynos",
	// get a document with the id [id] or get all posts if no id is passed
	"_get": function _get(id, cb) {
		// support get(function() { ... });
		if (typeof id === "function") {
			cb = id; 
			id = null;
		}

		// check if in cache
		if (id !== null && this._cache[id]) {
			cb(null, null, this._cloneDoc(this._cache[id]));
			return;
		}
		// point url at view all on couch
		var uri = url.parse(this._base_url);
		uri.pathname += "/_design/posts/_view/all";
		uri.query = {
			"descending": JSON.stringify(true)
		};
		// if id set startkey & endkey to filter view down to single value
		if (id !== null) {
			uri.query.startkey = uri.query.endkey = JSON.stringify(id);
		}

		// request documents
		this._request({
			"uri": url.format(uri)
		}, this._db_error((function _callback(err, resp, body) {
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
	"_save": function _save(post, cb) {
		// doc changed so empty it from cache
		delete this._cache[post.id];

		// PUT document in couch
		this._request({
			"uri": this._base_url + "/" + post._id,
			"json": post,
			"method": "PUT"
		}, this._db_error(function _savePost(err, res, body) {
			if (body) {
				body.id = post.id;
				body.title = post.title;
			}
			cb(err, res, body);
		}));
	},
	// create a document
	"_create": function _create(data, cb) {
		var post = {
			"content": data.content,
			"title": data.title,
			"datetime": Date.now(),
			"type": "post"
		};

		this._get((function _get(err, res, body) {
			// get highest id and make the new id one higher.
			var id = body.rows.map(function _pluckId(v) {
				return v.value.id;
			}).reduce(function _findMaxId(prev, curr) {
				return prev < curr ? curr : prev;
			}, 0);

			post.id = ++id;

			post._id = uuid();

			this._request({
				"uri": this._base_url + "/" + post._id,
				"json": post,
				"method": "PUT"
			}, this._db_error(function _putPost(err, res, body) {
				if (body) {
					body.id = post.id;
					body.title = post.title;
				} 
				cb(err, res, body);
			}));
		}).bind(this));
	},
	// destroy document
	"_destroy": function _destroy(post, cb) {
		delete this._cache[post.id];
		// send DELETE to couch for doc & rev.
		var uri = url.parse(this._base_url);
		uri.pathname += "/" + post._id;
		uri.query = {
			"rev": post._rev
		};

		this._request({
			"url": url.format(uri),
			"method": "DELETE"
		}, this._db_error(cb));	
	},
	"getAllPosts": function _getAllPosts(req, res, next) {
		this._get(this._error(next, function _getAll(err, res, body) {
			if (body.rows !== undefined) {
				req.posts = body;
				next();	
			} 
		}));
	},
	"getPostById": function _getModel(req, res, next) {
		this._get(req.postId, this._error(next, function _get(err, res, body) {
			if (body._id !== undefined) {
				req.post = body;
				next();
			} 
		}));
	},
	"createPost": function _createPost(req, res, next) {
		this._create(req.body, this._error(next, function _save(err, res, body) {
			if (body.ok === true) {
				req.post = body;
				next();
			} 
		}));	
	},
	"savePost": function _savePost(req, res, next) {
		Object.keys(req.body).forEach(function _copyValues(key) {
			req.post[key] = req.body[key];
		});
		this._save(req.post, this._error(next, function _save(err, res, body) {
			if (body.ok === true) {
				next();
			}
		}));
	},
	"deletePost": function _deletePost(req, res, next) {
		this._destroy(req.post, this._error(next, function _delete(err, res, body) {
			if (body.ok === true || body === "") {
				next();
			} 
		}));	
	}
}), Trait(Base)));

// Create all view
Post._request({
	"url": Post._base_url + "/_design/posts"
}, Post._db_error(function _callback(err, resp, body) {
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
		}, Post._db_error(function _emitReady(err, data) {
			if (!err) {
				Post.emit("loaded");
			}
		}));
	} else {
		Post.emit("loaded");
	}
}));

module.exports = Post;