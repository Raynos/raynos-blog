var server = require("../../src/server.js"),
	Stak = require("stak"),
	pd = require("pd").extendNatives(true),
	User = require("../../src/domain/user.js"),
	UserModel = require("../../src/data/user.js"),
	request = require("request");

var options = {
	uri: "http://localhost:" + process.env.PORT,
	method: "GET",
	jar: false
};

var user = {
	username: "bob",
	email: "bob@bob.com",
	password: "secret",
	password_confirm: "secret"
};

function empty_create() {
	var that = this;
	User.create(user, function () {
		that.next();
	})
}

function empty_delete(test) {
	var that = this;
	UserModel.delete("org.couchdb.user:bob", function (err) {
		test.done();
	});
}

var postLoginStack = Stak.beget(
	empty_create,
	function (test) {
		var that = this;
		request.post(pd.make(options, {
			uri: options.uri + "/login",
			json: user
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 303);
			test.ok(res.headers.location === '/');
			that.next();
		})
	},
	empty_delete
);

var postRegisterStack = Stak.beget(
	function _create(test) {
		var that = this;
		request.post(pd.make(options, {
			uri: options.uri + "/register",
			json: user
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 303);
			test.ok(res.headers.location === "/login")
			that.next();
		})
	},
	empty_delete
);

module.exports = {
	setUp: function (done) {
		server(function _proxy(app) {
			done();
		});
	},
	"test GET /login": function (test) {
		test.expect(3);

		request(pd.make(options, {
			"uri": options.uri + "/login"
		}), function _callback(err, res, body) {
			console.log(err);
			test.ok(res.statusCode === 200, "statusCode is incorrect");
			test.ok(body.indexOf("Log in") > -1);
			test.ok(body.indexOf("<form") > -1);
			test.done();
		});
	},
	"test POST /login": function (test) {
		test.expect(2);
		postLoginStack.handler()(test);
	},
	"test POST /login fails": function (test) {
		test.expect(1);
		request.post(pd.make(options, {
			"uri": options.uri + "/login",
			json: { username: "troll", password: "no u no u" }
		}), function _callback(err, res, body) {
			test.ok(body.indexOf("username or password is incorrect") > -1);
			test.done();
		})
	},
	"test GET /register": function (test) {
		test.expect(3);

		request(pd.make(options, {
			uri: options.uri + "/register"
		}), function _callback(err, res, body) {
			test.ok(res.statusCode === 200);
			test.ok(body.indexOf("Sign Up") > -1);
			test.ok(body.indexOf("<form") > -1);
			test.done();
		});
	},
	"test POST /register": function (test) {
		test.expect(2);

		postRegisterStack.handler()(test);
	}
}