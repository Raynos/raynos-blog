var routil = require("routil")

var self = module.exports = routil.methods({
    "POST": createSession
})

self.setup = setup

function createSession(req, res, params) {
    routil.formBody(req, authenticateUser)

    function authenticateUser(body) {
        self.users.authenticate(body.name, body.password, handleAuth)
    }

    function handleAuth(err, user) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        if (user === null) {
            return routil.errorPage(req, res, new Error(
                "authentication unsuccessful"))
        }

        routil.session(req, res).set(user, redirect)
    }

    function writeToSession(err) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.redirect(req, res, params.redir || "/")
    }
}

function setup() {
    self.users = self.domains.users
}