//var posts = require("../public/model/posts.js"),
var markdown = require("markdown").markdown,
	r = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + 
				new Buffer(process.env.COUCH_USER + ":" + 
				process.env.COUCH_PWD).toString("base64")
		}
	}),
	uuid = require("node-uuid");


var base_url = "http://raynos.iriscouch.com/raynos";

var createURL = function _createURL(p) {
	return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
}

var fixURL = function _fixURL(p) {
	p.url = createURL(p);
	return p;
}

var view = function _view(p) {
	p.readable_time = new Date(p.datetime).toDateString()
	p.content = markdown.toHTML(p.content);
	fixURL(p);
	return p;
};

var error = function _error(f) {
	return function _errorProxy(err, res, body) {
		if (err) {
			console.log("error in blog");
			console.log(err);
		} else {
			f(err, res, body);
		}
	};
};

var noop = error(function _noop() {});

r({
	"url": base_url + "/_design/posts"
}, error(function _callback(err, resp, body) {
	if (JSON.parse(body).error === "not_found") {
		var view = {
			"all": {
				"map": "function(d) { if (d.type === 'post') emit(d.id, d); }"
			}
		};

		r({
			"url": base_url + "/_design/posts",
			"method": "PUT",
			"json": {
				"_id": "_design/posts",
				"views": view
			}
		}, noop);
	}
}));

var get = function(id, cb) {
	if (typeof id === "function") {
		cb = id; 
		id = null;
	}

	var uri = base_url + "/_design/posts/_view/all";
	if (id) {
		uri += "?startkey=" + 
			encodeURIComponent(JSON.stringify(id)) + 
			"&endkey=" + 
			encodeURIComponent(JSON.stringify(id));
	}

	r({
		"uri": uri
	}, error(function _callback(err, resp, body) {
		var rows = JSON.parse(body).rows;
		if (!rows || rows.length === 0) {
			cb(new Error("no results"), []);
		} else if (id !== null) {
			cb(null, rows[0].value);	
		} else {
			cb(null, rows);
		}
	}));
}

var save = function(data, id, cb) {
	r({
		"uri": base_url + "/" + id,
		"json": data,
		"method": "PUT"
	}, error(function _callback(err, resp, body) {
		cb();
	}));
}

module.exports = function _route(app) {

	app.get("/blog", function _index(req, res) {
		get(function _get(err, data) {
			res.render("blog/index", {
				"posts": data.map(function(p) {
					return view(p.value);
				})
			});
		});
	});

	app.get("/blog/new", function _new(req, res) {
		res.render("blog/new");
	});

	app.post("/blog", function _create(req, res) {
		var data = {
			"content": req.body.content,
			"title": req.body.title,
			"datetime": Date.now(),
			"type": "post"
		}

		get(function _get(err, rows) {
			var id = rows.map(function(v) {
				return v.value.id;
			}).reduce(function(prev, curr) {
				return prev < curr ? curr : prev;
			}, 0);

			data.id = ++id;

			save(data, uuid(), function _save() {
				res.redirect("blog/" + createURL(data));
			});		
		});
	});

	app.get("/blog/:id/edit", function _edit(req, res) {
		var id = +req.params.id
		
		get(id, function _get(err, val) {
			res.render("blog/edit", fixURL(val));
		});
	});

	app.get("/blog/:id/:title", function _show(req, res) {
		var id = +req.params.id;

		get(id, function _get(err, val) {
			if (err && err.message === "no results") {
				res.redirect("404");
			} else {
				res.render("blog/show", view(val));	
			}
		});
	});

	app.put("/blog/:id", function _update(req, res) {
		var id = +req.params.id;
		
		get(id, function _get(err, val) {
			val.title = req.body.title;
			val.content = req.body.content;

			save(val, val._id, function _save() {
				res.redirect("blog/" + createURL(val));
			});
		});
	});

	app.delete("/blog/:id", function _destroy(req, res) {
		var id = +req.params.id;

		get(id, function _get(err, val) {
			var uri = base_url + "/" + val._id + "?rev=" + val._rev;
			
			r({
				"url": uri,
				"method": "DELETE"
			}, function _callback() {
				res.redirect("/blog/")
			});
		});
	});

};

