var routil = require("routil")

module.exports = home

function home(req, res) {
    routil.redirect(req, res, "/posts")
}