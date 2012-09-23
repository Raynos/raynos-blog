var redirect = require("redirecter")

module.exports = home

function home(req, res) {
    redirect(req, res, "/posts")
}