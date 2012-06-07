var app = require("ncore"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    Browser = require("zombie"),
    mongoCol = require("mongo-col")

before(function (done) {
    app(done)
})

describe("Submitting new posts", function () {
    before(function (done) {
        mongoCol("Posts", "raynos-blog-test", function (collection) {
            collection.drop(done)
        })
    })

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