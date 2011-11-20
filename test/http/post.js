var server = require("../../src/server.js"),
	Stak = require("stak"),
	pd = require("pd").extendNatives(true),
	Post = require("../../src/domain/post.js"),
	PostModel = require("../../src/data/post.js"),
	request = require("request");

var options = {
	uri: "http://localhost:8080",
	method: "GET"
};

var correct_post = {
	content: "faz",
	title: "baz"
};

function correct_post_delete(test) {
	var id = this.id
	PostModel.delete("post:" + id, function (err, data) {
		test.done();
	});
}

function correct_post_create() {	
	var that = this;
	Post.create(correct_post, function (err, body) {
		that.next();
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
	"test GET /blog": function (test) {
		test.expect(2);
		request(pd.make(options, {
			"uri": options.uri + "/blog"
		}), function _callback(err, res, body) {
			test.ok(body.indexOf("blog") > -1);
			test.ok(body.indexOf("DOM-shim") > -1);
			test.done();
		});
	}
};