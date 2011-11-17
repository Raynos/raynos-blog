var UserModel = require("../../src/data/user.js"),
	pd = require("pd").extendNatives(true),
	Stak = require("stak"),
	error = require("error");

error.thrower = function (err) {
	console.log("throw", err);
};

var obj = {
	_id: "org.couchdb.user:temp_test",
	name: "temp_test",
	type: "user",
	roles: [],
	password_sha: "",
	salt: ""
};

function create(cb) {
	UserModel.insert(obj, cb);
}

function get(name, cb) {
	UserModel.get(name, cb)
}

function $delete(name, cb) {
	UserModel.delete(name, cb);
}

function empty_create() {
	var that = this;
	create(function (err, body) {
		that.next();
	});
}

function empty_delete(test) {
	$delete(obj._id, function (err, body) {
		test.done();
	});
}

var createStack = Stak.beget(
	function _create(test) {
		var that = this;
		create(function (err, body) {
			test.ok(body.id);
			test.ok(body.ok);
			that.id = body.id;
			that.next();
		});
	},
	function _get(test) {
		var that = this;
		get(obj._id, function (err, body) {
			test.equal(body.name, obj.name);
			test.equal(body.type, obj.type);
			test.equal(body.roles.length, obj.roles.length);
			test.equal(obj.password_sha, body.password_sha);
			test.equal(obj.salt, body.salt);
			test.ok(body._id);
			that.next();
		});
	},
	empty_delete
);

var createTwiceStack = Stak.beget(
	empty_create,
	function _createSecond(test) {
		var that = this;
		create(function (err, body) {
			test.ok(err);
			test.ok(err.error === "conflict");
			that.next();
		});
	},
	empty_delete
);

var getStack = Stak.beget(
	empty_create, 
	function _get(test) {
		var that = this;
		get(obj._id, function (err, body) {
			test.equal(body.name, obj.name);
			test.equal(body.type, obj.type);
			if (body.roles) {
				test.equal(body.roles.length, obj.roles.length);	
			}
			test.equal(obj.password_sha, body.password_sha);
			test.equal(obj.salt, body.salt);
			test.equal(obj._id, body._id);
			test.ok(body._rev);
			that.next();
		});
	},
	empty_delete
);

var deleteStack = Stak.beget(
	empty_create,
	function _delete(test) {
		$delete(obj._id, function (err, body) {
			console.log(body);
		});
	}
);

var run = false;

UserModel.emit("start");

module.exports = {
	'user': {
		'test get non-existant': function (test) {
			test.expect(1);
			get(obj._id, function (err, body) {
				test.ok(err.error === "not_found");
				test.done();
			});
		},
		'test get': function (test) {
			test.expect(7);
			getStack.handler()(test);
		},
		'test create': function (test) {
			test.expect(8);
			createStack.handler()(test);
		},
		'test delete': function (test) {
			test.done();
		},
		"test create twice": function (test) {
			test.expect(2);
			createTwiceStack.handler()(test);
		}
	} 
};