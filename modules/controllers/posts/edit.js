var routil = require("routil")

var self = module.exports = routil.methods({
    "GET": viewEditPage
})

function viewEditPage(req, res) {
    routil.errorPage(req, res, 501)
}