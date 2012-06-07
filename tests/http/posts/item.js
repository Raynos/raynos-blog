var app = require("ncore"),
    assert = require("assert"),
    after = require("after"),
    request = require("request")

before(function (done) {
    app(done)
})

describe("/posts/:postId", function () {
    var Posts,
        _id

    before(function (done) {
        Posts = require("mongo-col")(
            "Posts", "raynos-blog-test", function (collection) 
        {
            collection.drop(function (err) {
                if (err) {
                    return done(err)
                }

                Posts.insert({
                    title: "foo",
                    content: "bar"
                }, { 
                    safe: true
                }, function (err, docs) {
                    _id = docs[0]._id
                    done()
                })
            })
        })
    })

    describe("GET /posts/:postId", function () {
        it("should return JSON data of the blog post", function (done) {
            request({
                uri: "http://localhost:8080/posts/" + _id,
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 200, "status code is incorrect")
                assert.equal(body.title, "foo", "title is incorrect")
                assert.equal(body.content, "bar", "content is incorrect")
                done()
            })
        })

        it("should return 404 if malformed _id", function (done) {
            request({
                uri: "http://localhost:8080/posts/foo",
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 404, "status code is incorrect")
                assert(body.indexOf("Not Found") !== -1,
                    "body is incorrect")
                done()
            })
        })

        it("should return a 404 if not exists", function (done) {
            request({
                uri: "http://localhost:8080/posts/foofoofoofoo",
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 404, "status code is incorrect")
                assert(body.indexOf("Not Found") !== -1,
                    "body is incorrect")
                done()
            })
        })

    })

    describe("PUT /posts/:postId", function () {
        it("should update and redirect", function (done) {
            request({
                uri: "http://localhost:8080/posts/" + _id,
                method: "PUT",
                followRedirect: false,
                form: {
                    title: "one",
                    content: "two"
                }
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 302, "status code is incorrect")
                assert(body.indexOf("/posts/" + _id) !== -1,
                    "body does not contain correct uri")
                assert.equal(res.headers.location, "/posts/" + _id,
                    "redirect header is incorrect")

                Posts.findOne({
                    _id: _id
                }, function (err, doc) {
                    assert.equal(err, null, "error is not null")
                    assert.equal(doc.title, "one", "title is incorrect")
                    assert.equal(doc.content, "two", "content is incorrect")
                    done()
                })
            })
        })
    })

    describe("DELETE /posts/:postId", function () {
        it("should remove and redirect", function (done) {
            request({
                uri: "http://localhost:8080/posts/" + _id,
                method: "DELETE",
                followRedirect: false,
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 302, "status code is incorrect")
                assert.equal(res.headers.location, "/posts",
                    "redirect header is incorrect")
                assert.equal(body.redirect, "/posts",
                    "body location is incorrect")
                assert.equal(body.statusCode, 302, 
                    "status code in body is incorrect")

                Posts.findOne({
                    _id: _id
                }, function (err, doc) {
                    assert.equal(err, null, "error is not null")
                    assert.equal(doc, null, "doc is not null")
                    done()
                })
            })
        })

        it("should return an error if item does not exist", function (done) {
            request({
                uri: "http://localhost:8080/posts/" + _id,
                method: "DELETE",
                followRedirect: false,
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 500, "status code is incorrect")
                assert(body.indexOf("post not deleted") !== -1,
                    "error message is incorrect")
                done()
            })
        })

        it("should return a malformed id error", function (done) {
            request({
                uri: "http://localhost:8080/posts/done",
                method: "DELETE",
                followRedirect: false,
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "error is not null")
                assert.equal(res.statusCode, 500, "status code is incorrect")
                assert(body.indexOf("Argument passed in must be") !== -1,
                    "error message is incorrect")
                done()
            })  
        })
    })
})