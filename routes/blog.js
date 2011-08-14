//var posts = require("../public/model/posts.js"),
var markdown = require("markdown").markdown,
	r = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + new Buffer(process.env.COUCH_USER + ":" + process.env.COUCH_PWD).toString("base64")
		}
	}),
	uuid = require("node-uuid");


var base_url = "http://raynos.iriscouch.com/raynos";

var fixURL = function _fixURL(p) {
	p.url = encodeURIComponent(p.url);
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
		r({
			"url": base_url + "/_design/posts",
			"method": "PUT",
			"json": {
				"_id": "_design/posts",
				"views": {
					"all": {
						"map": "function(d) { if (d.type === 'post') emit(d.url, d); }"
					}
				}
			}
		}, noop);
	}
}));

var get = function(url, cb) {
	if (typeof url === "function") {
		cb = url; 
		url = null;
	}
	var uri = base_url + "/_design/posts/_view/all";
	if (url) {
		uri += "?startkey=" + encodeURIComponent(JSON.stringify(url)) + "&endkey=" + encodeURIComponent(JSON.stringify(url))
	}
	r({
		"uri": uri
	}, error(function _callback(err, resp, body) {
		var rows = JSON.parse(body).rows;
		if (!rows || rows.length === 0) {
			cb(new Error("no results"), []);
		} else if (url) {
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
			"url": req.body.title.split(" ").join("-"),
			"type": "post"
		}

		get(function _get(err, rows) {
			if (rows.some(function _some(r) {
				return r.value.title === data.title;
			})) {
				res.render("blog/new", {
					"title": data.title,
					"content": data.content,
					"invalidTitle": true
				});
			} else {
				save(data, uuid(), function _save() {
					res.redirect("blog/" + encodeURIComponent(data.url));
				});		
			}
		});
	});

	app.get("/blog/:url", function _show(req, res) {
		var url = req.params.url;

		get(url, function _get(err, val) {
			if (err && err.message === "no results") {
				res.redirect("404");
			} else {
				res.render("blog/show", view(val));	
			}
		});
	});

	app.get("/blog/:url/edit", function _edit(req, res) {
		var url = req.params.url
		
		get(url, function _get(err, val) {
			res.render("blog/edit", fixURL(val));
		});
	});

	app.put("/blog/:url", function _update(req, res) {
		var url = req.params.url;
		
		get(url, function _get(err, val) {
			val.title = req.body.title;
			val.content = req.body.content;

			save(val, val._id, function _save() {
				res.redirect("blog/" + encodeURIComponent(val.url));
			});
		});
	});

	app.delete("/blog/:url", function _destroy(req, res) {
		var url = req.params.url;

		get(url, function _get(err, val) {
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

