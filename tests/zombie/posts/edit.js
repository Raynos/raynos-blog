var app = require("../../../core"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    Browser = require("zombie"),
    mongoCol = require("mongo-col")

before(function (done) {
    app(done)
})

describe("Edit page", function () {
    var _id,
        Posts

    before(function (done) {
        Posts = mongoCol("Posts", "raynos-blog-test", function (collection) {
            collection.drop(function () {
                collection.insert({
                    title: "foo",
                    content: "bar"
                }, function (err, docs) {
                    if (err) {
                        return done(err)
                    }
                    _id = docs[0]._id
                    done()
                })
            })
        })
    })
    
    describe("submitting edit form", function () {
        it("should work", function (done) {
            var browser = new Browser,
                uri = "http://localhost:8080/posts/" + _id + "/edit"
            browser.visit(uri, function () {
                var doc = browser.document,
                    edit = doc.forms.edit,
                    title = edit.elements.title,
                    content = edit.elements.content

                assert.equal(title.value, "foo",
                    "title is incorrect")
                assert.equal(content.textContent, "bar",
                    "content is incorrect")

                browser
                    .fill("title", "foo2")
                    .fill("content", "bar2")
                    .pressButton("Submit", function () {
                        assert(browser.success, "browser did not succeed")

                        assert.equal(browser.text(".title"), "foo2",
                            "title is incorrect")
                        assert.equal(browser.text(".content"), "bar2",
                            "content is incorrect")
                        done()
                    })
            })
        })
    })

    describe("deleting a post", function () {
        it("should work", function (done) {
            var browser = new Browser,
                uri = "http://localhost:8080/posts/" + _id + "/edit"

            browser.visit(uri, function () {
                var doc = browser.document,
                    edit = doc.forms.edit,
                    title = edit.elements.title,
                    content = edit.elements.content

                assert.equal(title.value, "foo2",
                    "title is incorrect")
                assert.equal(content.textContent, "bar2",
                    "content is incorrect")

                browser
                    .pressButton("Delete post", function () {
                        assert(browser.success, "browser did not succeed")

                        var doc = browser.document

                        assert.equal(doc.location.pathname, "/posts",
                            "pathname is incorrect")

                        Posts.findOne({
                            _id: _id
                        }, function (err, doc) {
                            assert.equal(err, null, "error is not null")
                            assert.equal(doc, null, "doc is not null")
                            done()
                        })
                    })
            })
        })
    })
})

