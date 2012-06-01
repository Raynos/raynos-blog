var routil = require("../../lib/routil")

module.exports = {
    setup: function () {
        this.router.addRoute("/posts/new", routil.methods({
            "GET": this.renderNewPostPage
        }))
    },
    renderNewPostPage: function (req, res) {
        routil.template(req, res, "posts/new.ejs", {})
    }
}