var server = require("../../src/server.js"),
	Stak = require("stak"),
	pd = require("pd").extendNatives(true),
	Post = require("../../src/domain/post.js"),
	PostModel = require("../../src/data/post.js"),
	request = require("request");

var jar = request.jar()
request = request.defaults({jar:jar})

var options = {
	uri: "http://localhost:" + process.env.PORT,
	method: "GET"
};

var correct_post = {
	content: "I'm running my unit tests",
	title: "If you see this, my unit tests are broken :("
};

function correct_post_delete(test) {
	var id = this.id
	PostModel.delete(id, function (err, data) {
		test.done();
	});
}

function correct_post_create() {	
	var that = this;
	Post.construct(correct_post, function (err, body) {
		that.id = body.id;
		that.next();
	});
}

var postBlogStack = Stak.beget(
	function (test) {
		var that = this;
		request.post(pd.make(options, {
			uri: options.uri + "/blog",
			json: correct_post
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 302);
			that.id = res.headers.location.split("/")[4];
			var title = res.headers.location.split("/")[5];
			test.ok(title === encodeURIComponent(correct_post.title.replace(/\s/g, "-")));
			that.next();
		});
	},
	correct_post_delete
);

var putBlogPostStack = Stak.beget(
	correct_post_create,
	function (test) {
		var that = this;
		request.put(pd.make(options, {
			uri: options.uri + "/blog/" + that.id,
			json: correct_post
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 302);
			that.id = res.headers.location.split("/")[4];
			var title = res.headers.location.split("/")[5];
			test.ok(title === encodeURIComponent(correct_post.title.replace(/\s/g, "-")));
			that.next();
		});
	},
	correct_post_delete
);

var deleteBlogPostStack = Stak.beget(
	correct_post_create,
	function (test) {
		request(pd.make(options, {
			method: "DELETE",
			followRedirect: false,
			uri: options.uri + "/blog/" + this.id
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 302);
			test.ok(res.headers.location = "/blog");
			test.done();
		})
	}
);

var user = {
	username: "Raynos",
	password: process.env.USER_PWD
};

function login(cb) {
	request.post(pd.make(options, {
		uri: options.uri + "/login",
		json: user
	}), function (err, res, body) {
		cb();
	});
}

module.exports = {
	setUp: function (done) {
		server(function _proxy(app) {
			done();
		});
	},
	"test GET /": function (test) {
		test.expect(2);
		request(pd.make(options, {
			"uri": options.uri + "/",
			"followRedirect": false
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 302);
			test.ok(res.headers.location.indexOf("blog") > -1);
			test.done();
		});
	},
	"test GET /rss": function (test) {
		test.expect(2);
		request(pd.make(options, {
			uri: options.uri + "/rss"
		}), function _callback(err, res, body) {
			test.ok(body.indexOf("xml") > -1);
			test.ok(body.indexOf("Raynos") > -1);
			test.done();
		});
	},
	"test GET /blog": function (test) {
		test.expect(2);
		request(pd.make(options, {
			"uri": options.uri + "/blog"
		}), function _callback(err, res, body) {
			test.ok(body.indexOf("blog") > -1);
			test.ok(body.indexOf("DOM-shim") > -1);
			test.done();
		});
	},
	"test GET /blog/:id": function (test) {
		test.expect(2);
		request(pd.make(options, {
			"uri": options.uri + "/blog/12/fakeTitle"
		}), function _callback(err, res, body) {
			test.ok(body.indexOf("DOM-shim") > -1);
			test.ok(body.indexOf("Reasons not to use abstractions:") > -1);
			test.done();
		});
	},
	"test GET /blog/new": function (test) {
		test.expect(2);
		login(function _loggedIn(err, res, body) {
			request(pd.make(options, {
				"uri": options.uri + "/blog/new"
			}), function _callback(err, res, body) {
				test.ok(body.indexOf("<form") > -1, 
					"new page does not contain a form");
				test.ok(body.indexOf("New Post") > -1, 
					"new page does not contain the words New post");
				test.done();
			});
		});
	},
	"test GET /blog/:id/edit": function (test) {
		test.expect(2);
		login(function _loggedIn(err, res, body) {
			request(pd.make(options, {
				"uri": options.uri + "/blog/12/edit"
			}), function _callback(err, res, body) {
				test.ok(body.indexOf("<form") > -1);
				test.ok(body.indexOf("Edit Post") > -1);
				test.done();
			});
		});
	},
	"test POST /blog/": function (test) {
		test.expect(2);
		postBlogStack.handler()(test);
	},
	"test PUT /blog/:id": function (test) {
		test.expect(2);
		putBlogPostStack.handler()(test);
	},
	"test DELETE /blog/:id": function (test) {
		test.expect(2);
		deleteBlogPostStack.handler()(test);
	}
};