var routil = require("routil")

module.exports = routil.methods({
    "GET": renderNewSessionsPage
})

function renderNewSessionsPage(req, res) {
    routil.template(req, res, "sessions/new.ejs", {})
}