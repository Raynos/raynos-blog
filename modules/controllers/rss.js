var routil = require("routil")

var self = module.exports = routil.methods({
    "GET": getRss
})

function getRss(req, res) {
    routil.errorPage(req, res, 501)
}