var User = require("../../src/domain/user.js"),
	UserModel = require("../../src/data/user.js"),
	pd = require("pd").extendNatives(true),
	Stak = require("stak"),
	error = require("error");

error.thrower = function (err) {
	console.log("throw", err);
};

UserModel.emit("start");

var obj = {
	_id: "org.couchdb.user:temp_test",
	name: "temp_test",
	type: "user",
	roles: [],
	password: "foobar",
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

var getStack = Stak.beget(
	empty_create,
	function _get(test) {
		var that = this;
		User.get(obj.name, function (err, user) {
			test.ok(user);
			test.ok(obj.name === user.name);
			test.ok(obj.name === user.id);
			that.next();
		});
	},
	empty_delete
);

function correct_user_delete(test) {
	UserModel.delete("org.couchdb.user:correctTwo", function (err, data) {
		test.done();
	});
}

function correct_user_create() {	
	var that = this;
	User.create(correct_user, function (err, body) {
		that.next();
	});
}

var testPasswordStack = Stak.beget(
	correct_user_create,
	function _get(test) {
		var that = this;
		User.get(correct_user.username, function (err, user) {
			var err = user.validatePassword("correct");
			test.ok(err === undefined);
			var err = user.validatePassword("Foobar");
			test.ok(err === "Login failed");
			that.next();
		})
	},
	correct_user_delete
);

var correct_user = {
	password: "correct",
	password_check: "correct",
	email: "foo@bar.baz",
	username: "correctTwo"
};

var createStack = Stak.beget(
	function _create(test) {
		var that = this;
		User.create(correct_user, function (err, user) {
			test.ok(user);
			test.ok(user.id === "correctTwo");
			test.ok(user.salt);
			test.ok(user.password_sha);
			that.next();
		});
	},
	correct_user_delete
)

var createConflictStack = Stak.beget(
	correct_user_create,
	function _create(test) {
		var that = this;
		User.create(correct_user, function (err, user) {
			test.ok(err);
			test.ok(err[0] === "The user name is already taken");
			that.next();
		});
	},
	correct_user_delete	
);

module.exports = {
	'user': {
		'test get': function (test) {
			test.expect(3);
			getStack.handler()(test);
		},
		'test get non-existant': function (test) {
			test.expect(3);
			User.get(obj.name, function (err, user) {
				test.ok(user === null);
				test.ok(err);
				test.ok(err.error === "not_found");
				test.done();
			})
		},
		'test make': function (test) {
			test.expect(3);
			var ret = User.make({
				name: "foobar",
				_id: "org.couchdb.user:foo"
			});
			test.ok(ret);
			test.ok(ret.name === "foobar");
			test.ok(ret.id === "foo");
			test.done();
		},
		'test validatePassword': function (test) {
			test.expect(2);
			testPasswordStack.handler()(test);
		},
		'test validate': function (test) {
			test.expect(7);
			var errors = User.validate({
				password: "foo",
				username: "b#",
				email: "not_valid",
				password_check: "different",
			});
			test.ok(errors.length === 5);
			test.ok(errors.indexOf("The minimum password length is 5") !== -1);
			test.ok(errors.indexOf("The minimum username length is 3"));
			test.ok(errors.indexOf("The username needs to be alphanumeric"));
			test.ok(errors.indexOf("The email is invalid"));
			test.ok(errors.indexOf("passwords are not the same"));
			var errors = User.validate(correct_user);
			test.ok(errors === undefined);
			test.done();
		},
		'test create': function (test) {
			test.expect(4);
			createStack.handler()(test);
		},
		'test create conflict': function (test) {
			test.expect(2);
			createConflictStack.handler()(test);
		}
	}
}
