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

describe("")