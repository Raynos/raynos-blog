var app = require("ncore"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    Posts

before(function (done) {
    app(done)
})

describe("/posts", function () {
    before(function (done) {
        Posts = require("mongo-col")(
            "Posts", "raynos-blog-test", function (collection) 
        {
            collection.drop(done)
        })    
    })
    
    describe("POST /posts", function () {
        it("should save redirect if succesful", function (done) {
            request({
                uri: "http://localhost:8080/posts",
                form: {
                    title: "foo",
                    content: "bar"
                },
                method: "POST",
                followRedirect: false
            }, function (err, res, body) {
                assert.equal(err, null, "err is not null")
                assert(res.headers.location.indexOf("/posts/") !== -1,
                    "redirect header is incorrect")
                assert(body.indexOf("/posts/") !== -1,
                    "redirect in body is incorrect")
                done()
            })
        })
    })

    describe("GET /posts", function () {
        it("should show posts in JSON", function (done) {
            request({
                uri: "http://localhost:8080/posts",
                json: true
            }, function (err, res, body) {
                assert.equal(err, null, "err is not null")
                assert(body, "posts do not exist")
                assert.equal(body[0].title, "foo", "title is incorrect")
                assert.equal(body[0].content, "bar", "content is incorrect")
                done()
            })
        })
    })  
})