var PostModel = require("../../src/data/post.js"),
	pd = require("pd").extendNatives(true),
	Stak = require("stak"),
	error = require("error");

error.thrower = function (err) {
	console.log("throw", err);
}

PostModel.start();

var obj = {
	_id: "post:bob",
	type: "post",
	id: "42",
	content: "foobar"
}

function empty_create() {
	var that = this;
	PostModel.insert(obj, function (err, body) {
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

		PostModel.get(obj._id, function (err, body) {
			test.ok(body.id === obj.id);
			test.ok(body._id === obj._id);
			test.ok(body.content === obj.content);
			test.ok(body.type === obj.type);
			test.ok(body._rev);
			that.next();
		});
	},
	empty_delete
);

var createStack = Stak.beget(
	function _create(test) {
		var that = this;

		PostModel.insert(obj, function (err, body) {
			test.ok(body.id);
			test.ok(body.ok);
			that.next();
		});
	},
	function _get(test) {
		var that = this;
		PostModel.get(obj._id, function (err, body) {
			test.ok(body.id === obj.id);
			test.ok(body._id === obj._id);
			test.ok(body.content === obj.content);
			test.ok(body.type === obj.type);
			test.ok(body._rev);
			that.next();
		});
	},
	empty_delete
);

var createTwiceStack = Stak.beget(
	empty_create,
	function _createSecond(test) {
		var that = this;
		PostModel.insert(obj, function (err, body) {
			test.ok(err);
			test.ok(err.error === "conflict");
			that.next();
		});
	},
	empty_delete
);

var deleteStack = Stak.beget(
	empty_create,
	function _delete(test) {
		PostModel.delete(obj._id, function (err, body) {
			test.ok(body.ok);
			test.ok(body.id === obj._id);
			test.done();
		});
	}
);

module.exports = {
	'post': {
		'test get non-existant': function (test) {
			test.expect(1);
			PostModel.get("bob", function (err, body) {
				test.ok(err.error === "not_found");
				test.done();
			})
		},
		"test get": function (test) {
			test.expect(5);
			getStack.handler()(test);
		},
		"test create": function (test) {
			test.expect(7);
			createStack.handler()(test);
		},
		"test delete": function (test) {
			test.expect(2);
			deleteStack.handler()(test);
		},
		"test create twice": function (test) {
			test.expect(2);
			createTwiceStack.handler()(test);
		}
	}
}