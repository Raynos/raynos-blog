var app = require("../../../core"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    Posts

before(function (done) {
    done = after(2, done)
    app(done)
    Posts = require("mongo-col")("Posts", "raynos-blog-test", 
        function (collection) {
            collection.drop(done)
        })
})  

describe("GET /posts/:postId/edit", function () {
    var _id

    before(function (done) {
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

    it("should render a HTML form", function (done) {
        request({
            uri: "http://localhost:8080/posts/" + _id + "/edit"
        }, function (err, res, body) {
            assert.equal(err, null, "error is not null")
            assert.equal(res.statusCode, 200, "status code is incorrect")
            assert(body.indexOf("<form") !==  -1, 
                "body does not contain a form")
            done()
        })
    })
})