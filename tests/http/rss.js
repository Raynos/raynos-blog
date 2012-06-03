var app = require("../../core"),
    assert = require("assert"),
    after = require("after"),
    request = require("request"),
    FeedParser = require("feedparser")

before(function (done) {
    app(done)
})

describe("GET /rss", function () {
    var date = Date.now(),
        Posts,
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
                    content: "bar",
                    datetime: date
                }, { 
                    safe: true
                }, function (err, docs) {
                    _id = docs[0]._id
                    done()
                })
            })
        })
    })

    it("should return rss", function (done) {
        request({
            uri: "http://localhost:8080/rss"
        }, function (err, res, body) {
            assert.equal(err, null, "error is not null")
            assert.equal(res.statusCode, 200, "status code is incorrect")
            assert.equal(res.headers["content-type"], "application/rss+xml",
                "content-type header is incorrect")

            var parser = new FeedParser
            parser.parseString(body, function (err, meta, articles) {
                assert.equal(err, null, "a feed parser error occurred")

                assert.equal(meta["#type"], "rss", "feed type is incorrect")
                assert.equal(meta["#version"], "2.0", 
                    "feed version is incorrect")
                assert.equal(meta.title, "Raynos Blog",
                    "blog title is incorrect")
                assert.equal(meta.description, "Node and JavaScript blog",
                    "blog description is incorrect")
                assert.equal(meta.link, "http://raynos.org/posts",
                    "blog link is incorrect")

                var article = articles[0]


                assert.equal(article.title, "foo", "article title is incorrect")
                assert.equal(article.description, "<p>bar</p>", 
                    "article description is incorrect")
                assert.equal(article.pubDate.toISOString(), 
                    new Date(date).toISOString(),
                    "article pubDate is incorrect")
                assert.equal(article.link, article.guid, 
                    "article link is not the same as guid")
                assert.equal(article.link, 
                    "http://raynos.org/posts/" + _id + "/foo",
                    "article link is incorrect")

            })

            done()
        })
    })
})