var Post = require("../../src/domain/post.js"),
	PostModel = require("../../src/data/post.js"),
	pd = require("pd").extendNatives(true),
	Stak = require("stak"),
	error = require("error");

error.thrower = function (err) {
	console.log("throw", err);
};

PostModel.start();

var obj = {
	_id: "post:42",
	content: "foobar",
	datetime: Date.now(),
	id: "42",
	title: "foo",
	type: "post"
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

function empty_create() {
	var that = this;
	PostModel.insert(obj, function (err, body) {
		that.id = body.id;
		that.next();
	});
}

function empty_delete(test) {
	PostModel.delete(obj._id, function (err, body) {
		test.done();
	});
}

var getStack = Stak.beget(
	empty_create,
	function _get(test) {
		var that = this;
		Post.get(obj.id, function (err, post) {
			test.ok(post);
			test.ok(obj.content === post.content);
			test.ok(obj.title === post.title);
			console.log(obj.id, post.id);
			test.ok(obj.id === post.id, "ids not the same");
			test.ok(obj.datetime === post.datetime, "datetime failed");
			that.next();
		});
	},
	empty_delete
);

var createStack = Stak.beget(
	function _create(test) {
		var that = this;
		Post.create(correct_post, function (err, post) {
			test.ok(post);
			test.ok(post.id);
			test.ok(post._id);
			test.ok(post.datetime);
			test.ok(post.type);
			that.id = post.id;
			that.next();
		});
	},
	correct_post_delete
);


module.exports = {
	"post": {
		"test get": function (test) {
			test.expect(5);
			getStack.handler()(test);
		},
		"test get non-existant": function (test) {
			test.expect(3);
			Post.get(obj.id, function (err, post) {
				test.ok(post === null);
				test.ok(err);
				test.ok(err.error === "not_found");
				test.done();
			})
		},
		'test make': function (test) {
			test.expect(2);
			var ret = Post.make(obj);
			test.ok(ret);
			test.ok(ret.id === obj.id);
			test.done();
		},
		"test create": function (test) {
			test.expect(5);
			createStack.handler()(test);
		},
		"test validate": function (test) {
			test.expect(4);
			var errors = Post.validate({
				content: "",
				title: ""
			});
			test.ok(errors.length === 2);
			test.ok(errors.indexOf("content field should not be empty") > -1);
			test.ok(errors.indexOf("title field should not be empty") > -1);
			var errors = Post.validate(correct_post);
			test.ok(errors === undefined);
			test.done();
		}
	},

}
