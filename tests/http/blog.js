var app = require("../../core"),
    assert = require("assert"),
    request = require("request")

before(function (done) {
    app(done)
})

describe("GET /blog", function () {
    it("should redirect", function (done) {
        request({
            uri: "http://localhost:8080/blog",
            followRedirect: false
        }, function (err, res, body) {
            assert.equal(err, null, "error is not null")
            assert.equal(res.statusCode, 302, "status code is incorrect")
            assert(res.headers.location.indexOf("/posts") !==  -1, 
                "location header does not contain /posts")
            assert(body.indexOf("/posts") !==  -1, 
                "body does not contain /posts")
            done()
        })
    })
})