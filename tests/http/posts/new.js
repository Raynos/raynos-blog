var app = require("ncore"),
    assert = require("assert"),
    request = require("request")

before(function (done) {
    app(done)
})

describe("GET /posts/new", function () {
    it("should render a HTML form", function (done) {
        request({
            uri: "http://localhost:8080/posts/new"
        }, function (err, res, body) {
            assert.equal(err, null, "error is not null")
            assert.equal(res.statusCode, 200, "status code is incorrect")
            assert(body.indexOf("<form") !==  -1, 
                "body does not contain a form")
            done()
        })
    })
})