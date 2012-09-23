var methods = require("http-methods")
    , repo = require("../repo")

module.exports = methods({
    "GET": generateRss
})

function generateRss(req, res) {
    repo.allPosts(function (err, posts) {
        /* create RSS */
    })
}