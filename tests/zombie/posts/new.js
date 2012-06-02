var app = require("../../../core"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    Browser = require("zombie"),
    Posts

before(function (done) {
    done = after(2, done)
    app(done)
    Posts = require("mongo-col")("Posts", "raynos-blog-test", 
        function (collection) {
            collection.drop(done)
        })
})

describe("Submitting new posts", function () {
    it("should work", function (done) {
        var browser = new Browser
        browser.visit("http://localhost:8080/posts/new", function () {
            browser
                .fill("title", "foo")
                .fill("content", "bar")
                .pressButton("Submit", function () {
                    assert(browser.success, "browser did not succeed")

                    assert.equal(browser.text(".title"), "foo",
                        "title is incorrect")
                    assert.equal(browser.text(".content"), "bar",
                        "content is incorrect")
                    done()
                })
        })
    })
})