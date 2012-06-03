var posts = require("../../../modules/viewModels/posts"),
    assert = require("assert")

describe("viewModel posts", function () {
    describe("viewOneRaw", function () {
        it("should return a correct url", function () {
            var url = posts.viewOneRaw({
                _id: "foo",
                title: "bar baz"
            }).url

            assert.equal(url, "/posts/foo/bar-baz",
                "url is incorrect")
        })

        it("should return a correct readableTime", function () {
            var date = Date.now()
            var readableTime = posts.viewOneRaw({
                datetime: date,
                _id: "foo",
                title: "bar"
            }).readableTime

            assert.equal(readableTime, new Date(date).toDateString(),
                "readableTime is incorrect")
        })
    })

    describe("viewOne", function () {
        it("should return a correct url", function () {
            var url = posts.viewOne({
                _id: "foo",
                title: "bar baz",
                content: ""
            }).url

            assert.equal(url, "/posts/foo/bar-baz",
                "url is incorrect")
        })

        it("should return a correct readableTime", function () {
            var date = Date.now()
            var readableTime = posts.viewOne({
                datetime: date,
                _id: "foo",
                title: "bar",
                content: ""
            }).readableTime

            assert.equal(readableTime, new Date(date).toDateString(),
                "readableTime is incorrect")
        })

        it("should return the content as html", function () {
            var content = posts.viewOne({
                _id: "foo",
                title: "bar",
                content: "bar"
            }).content

            assert.equal(content, "<p>bar</p>\n")
        })
    })

    describe("viewAll", function () {
        it("should return a correct url", function () {
            var url = posts.viewAll([{
                _id: "foo",
                title: "bar baz",
                content: ""
            }])[0].url

            assert.equal(url, "/posts/foo/bar-baz",
                "url is incorrect")
        })

        it("should return a correct readableTime", function () {
            var date = Date.now()
            var readableTime = posts.viewAll([{
                datetime: date,
                _id: "foo",
                title: "bar",
                content: ""
            }])[0].readableTime

            assert.equal(readableTime, new Date(date).toDateString(),
                "readableTime is incorrect")
        })

        it("should return the content as html", function () {
            var content = posts.viewAll([{
                _id: "foo",
                title: "bar",
                content: "bar"
            }])[0].content

            assert.equal(content, "<p>bar</p>\n")
        })
    })
})