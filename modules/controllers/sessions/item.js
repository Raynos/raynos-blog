var routil = require("routil")

module.exports = routil.methods({
    "DELETE": deleteSession
})

function deleteSession(req, res, params) {
    routil.session(req, res).destroy(function (err) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.redirect(req, res, "/")
    })
}

/* Auth layer

function (req, res) {
    routil.session(req, res).get(function (err, user) {
        if (user) {
            ...
        } else {
            routil.redirect(req, res, "/login")
        }
    })
}

*/