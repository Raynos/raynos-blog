var routil = require("../../lib/routil")

module.exports = {
    setup: function () {
        this.router.addRoute("/", this.home)
    },
    home: function (req, res, params) {
        routil.redirect(req, res, "/posts")
    }
}