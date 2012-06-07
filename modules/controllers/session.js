var routil = require("routil"),
    validate = require("validate"),
    createSession = routil.createSession,
    getSession = routil.getSession,
    destroySession = routil.destroySession,
    redirect = routil.redirect,
    template = routil.template,
    errorPage = routil.errorPage,
    formBody = routil.formBody

var self = module.exports = routil.methods({
    "POST": createSession,
    "GET": renderSessionPage,
    "DELETE": deleteSession
})

var PostSchema = {
    name: {
        type: 'string',
        required: true
    },
    password: {
        type: 'string',
        required: true
    }
}

self.setup = setup

function createSession(req, res, params) {
    formBody(req, authenticateUser)

    function authenticateUser(body) {
        var sanitized = validate(PostSchema, body)
        if (Array.isArray(sanitized)) {
            return errorPage(req, res, sanitized[0])
        }

        self.users.authenticate(sanitized.name, 
            sanitized.password, handleAuth)
    }

    function handleAuth(err, user) {
        if (err) {
            return errorPage(req, res, err)
        }

        if (user === null) {
            return errorPage(req, res, new Error(
                "authentication unsuccessful"))
        }

        createSession(req, res, user, redirect)
    }

    function redirect(err) {
        if (err) {
            return errorPage(req, res, err)
        }

        redirect(req, res, params.redir || "/")
    }
}

function renderSessionPage(req, res) {
    getSession(req, res, renderCorrectTemplate)

    function renderCorrectTemplate(err, user)  {
        if (user === null) {
            template(req, res, "session/new.ejs", {})
        } else {
            template(req, res, "session/delete.ejs", {})
        }
    }
}

function deleteSession(req, res, params) {
    destroySession(req, res, redirect)

    function redirect(err) {
        if (err) {
            return errorPage(req, res, err)
        }

        redirect(req, res, "/")
    }
}

/* Auth layer

function (req, res) {
    getSessionData(req, res, function (err, user) {
        if (err) {
            errorPage(req, res, err)
        }

        ...
    })
}

*/

function setup() {
    self.users = self.domains.users
}