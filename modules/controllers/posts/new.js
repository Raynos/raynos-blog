var routil = require("routil")

module.exports = routil.methods({
    "GET": renderNewPostsPage
})

function renderNewPostsPage(req, res) {
    routil.template(req, res, "posts/new.ejs", {})
}