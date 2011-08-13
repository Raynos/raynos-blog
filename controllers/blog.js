//var posts = require("../public/model/posts.js"),
var markdown = require("markdown").markdown,
	r = require("request").defaults({
		"headers": {
			"Authorization": "Basic " + new Buffer(process.env.COUCH_USER + ":" + process.env.COUCH_PWD).toString("base64")
		}
	}),
	uuid = require("node-uuid");


var base_url = "http://raynos.iriscouch.com/raynos";

var view = function _view(p) {
	p.readable_time = new Date(p.datetime).toDateString()
	p.content = markdown.toHTML(p.content);
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
	r({
		"uri": base_url + "/_design/posts/_view/all?startkey=" + encodeURIComponent(JSON.stringify(url)) + "&endkey=" + encodeURIComponent(JSON.stringify(url))
	}, error(function _callback(err, resp, body) {
		cb(JSON.parse(body).rows[0].value);		
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

exports.index = function _index(req, res) {
	r({
		"uri": base_url + "/_design/posts/_view/all/",
		"method": "GET"
	}, error(function _callback(err, resp, body) {
		res.render("blog/index", {
			"posts": JSON.parse(body).rows.map(function(p) { 
				return view(p.value) 
			})
		})
	}));
};

exports.new = function _new(req, res) {
	res.render("blog/new");
};

exports.create = function _create(req, res) {
	var data = {
		"content": req.body.content,
		"title": req.body.title,
		"datetime": Date.now(),
		"url": req.body.title.split(" ").join("-"),
		"type": "post"
	}

	save(data, uuid(), function _save() {
		res.render("blog/" + data.url);
	});
};

exports.show = function _show(req, res) {
	var url = req.params.blog;

	get(url, function _get(val) {
		res.render("blog/show", view(val));
	});
};

exports.edit = function _edit(req, res) {
	var url = req.params.blog
	
	get(url, function _get(val) {
		res.render("blog/edit", val);
	});
};

exports.update = function _update(req, res) {
	var url = req.params.blog;
	
	get(url, function _get(val) {
		val.title = req.body.title;
		val.content = req.body.content;

		save(val, val._id, function _save() {
			res.redirect("blog/" + val.url);
		})
	});
};

exports.destroy = function _destroy(req, res) {
	var url = req.params.blog;

	get(url, function _get(val) {
		var uri = base_url + "/" + val._id + "?rev=" + val._rev;
		
		r({
			"url": uri,
			"method": "DELETE"
		}, function _callback() {
			res.redirect("/blog/")
		});
	});
}