var routil = require("routil")

module.exports = blog

function blog(req, res) {
    routil.redirect(req, res, "/posts")
}