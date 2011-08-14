//var posts = require("../public/model/posts.js"),
var markdown = require("markdown").markdown,
	Posts = require("../public/model/post.js");

var createURL = function _createURL(p) {
	return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
}

var fixURL = function _fixURL(p) {
	p = (p[0] || p).value;
	p.url = createURL(p);
	return p;
}

var view = function _view(p) {
	p = fixURL(p);
	p.readable_time = new Date(p.datetime).toDateString()
	p.content = markdown.toHTML(p.content);
	return p;
};

module.exports = function _route(app) {

	app.get("/blog", function _index(req, res) {
		Posts.get(function _get(err, data) {
			res.render("blog/index", {
				"posts": data.map(view)
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

		Posts.get(function _get(err, rows) {
			var id = rows.map(function _pluckId(v) {
				return v.value.id;
			}).reduce(function _findMaxId(prev, curr) {
				return prev < curr ? curr : prev;
			}, 0);

			data.id = ++id;

			Posts.create(data, function _save() {
				res.redirect("blog/" + createURL(data));
			});		
		});
	});

	app.get("/blog/:id/edit", function _edit(req, res) {
		var id = +req.params.id
		
		Posts.get(id, function _get(err, rows) {
			res.render("blog/edit", fixURL(rows));
		});
	});

	app.get("/blog/:id/:title", function _show(req, res) {
		var id = +req.params.id;

		Posts.get(id, function _get(err, rows) {
			if (err && err.message === "no results") {
				res.redirect("404");
			} else {
				res.render("blog/show", view(rows));	
			}
		});
	});

	app.put("/blog/:id", function _update(req, res) {
		var id = +req.params.id;
		
		var val = {
			"title": req.body.title,
			"content": req.body.content,
			"id": id
		};

		Posts.save(val, function _save() {
			res.redirect("blog/" + createURL(val));
		});
	});

	app.delete("/blog/:id", function _destroy(req, res) {
		var id = +req.params.id;

		Posts.destroy(id, function _delete() {
			res.redirect("/blog/")
		});
	});

};

