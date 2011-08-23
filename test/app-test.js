var is = require("vows-is");

is.config({
	"server": {
		"factory": require("../server.js"),
		"uri": "http://localhost:" + (process.env.PORT || 8080),
		"defaults": {
			"followRedirect": false
		}
	}
});

is.partial("redirect", function _partial(context, options) {
	return context
		.vow.it.should.not.error
		.vow.it.should.have.status(302)

		.partial("body")
			.vow.it.should.include.string(options.url)
				.and.string("Moved Temporarily")
			.suite();
});

is.partial("200", function _partial(context) {
	return context
		.vow.it.should.not.error
		.vow.it.should.have.status(200)
		.vow.it.should.have.header("content-type", "text/html; charset=utf-8");
});

is.partial("body", function _partial(context) {
	return context.context("contains a body that")
		.topic.is.property("body")
		.vow.it.should.be.ok;
});

is.suite("app").batch()

	.context("a request to GET /")
		.topic.is.a.request("GET /")
		.partial("redirect", {
			"url": "/blog"
		})

.batch()

	.context("a request to GET /blog")
		.topic.is.a.request("GET /blog")
		.partial("200")

		.partial("body")
			.vow.it.should.include.string("blog")
				.and.string("Raynos")
			.suite()

.batch()

	.context("a request to POST /blog")
		.topic.is.a.request("POST /blog")
		.partial("redirect", {
			"url": "/login"
		})

.batch()

	.context("a request to GET /blog/1/edit")
		.topic.is.a.request("GET /blog/0/edit")
		.partial("redirect", {
			"url": "/login"
		})

.batch()

	.context("a request to GET /blog/new")
		.topic.is.a.request("GET /blog/new")
		.partial("redirect", {
			"url": "/login"
		})

.batch()

	.context("a request to GET /blog/1")
		.topic.is.a.request("GET /blog/1")
		.partial("200")

		.partial("body")
			.vow.it.should.include.string("blog")
				.and.string("Building a blog with node.js")
			.suite()

.batch()

	.context("a request to PUT /blog/1")
		.topic.is.a.request("PUT /blog/1")
		.partial("redirect", {
			"url": "/login"
		})

.batch()

	.context("a request to DELETE /blog/1")
		.topic.is.a.request("DELETE /blog/1")
		.partial("redirect", {
			"url": "/login"
		})

.batch()
	
	.context("a request to GET /signup")
		.topic.is.a.request("GET /signup")
		.partial("200")

		.partial("body")
			.vow.it.should.include.string("signup")
				.and.string("<form")
				.and.string("username")
				.and.string("password")
				.and.string("email")
				.and.string("confirm password")
			.suite()

.batch()

	.context("a request to GET /login")
		.topic.is.a.request("GET /login")
		.partial("200")

		.partial("body")
			.vow.it.should.include.string("login")
				.and.string("<form")
				.and.string("username")
				.and.string("password")
			.suite()

.batch()

	.context("a request to POST /login")
		.topic.is.a.request("POST /login")
		.partial("redirect", {
			"url": "/"
		})

.batch()

	.context("a request to POST /signup")
		.topic.is.a.request("POST /signup")
		.partial("redirect", {
			"url": "/"
		})

.export(module);