var routil = require("routil"),
    validate = require("validate")

var PutSchema = {
    title: {
        required: true,
        type: "string"
    },
    content: {
        required: true,
        type: "string"
    }
}

var self = module.exports = routil.methods({
    "GET": getPost,
    "PUT": putPost,
    "DELETE": deletePost
}, true)

function getPost(req, res, params) {
    self.domain.getPost(params.postId, renderPost)

    function renderPost(err, post) {
        if (err) {
            if (err.message === "Argument passed in must be a single String" +
                " of 12 bytes or a string of 24 hex characters"
            ) {
                return routil.errorPage(req, res, 404)
            }

            return routil.errorPage(req, res, err)
        }

        if (post === null) {
            return routil.errorPage(req, res, 404)
        }

        routil.mediaTypes(req, res, {
            "application/json": function  () {
                routil.sendJson(res, post)
            },
            default: function () {
                routil.template(req, res, "posts/view.ejs", post)
            }
        })()
    }
}

function putPost(req, res, params) {
    routil.formBody(req, res, sanitizeData)

    function sanitizeData(body) {
        var sanitized = validate(PutSchema, body)
        if (Array.isArray(sanitized)) {
            return routil.errorPage(req, res, sanitized[0])
        }

        self.domain.updatePost(params.postId, sanitized, redirectToPost)
    }

    function redirectToPost(err, updated) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.redirect(req, res, "/posts/" + params.postId)
    }
}

function deletePost(req, res, params) {
    self.domain.deletePost(params.postId, redirectToPosts)

    function redirectToPosts(err, updated) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        if (updated === 0) {
            return routil.errorPage(req, res, new Error("post not deleted"))
        }

        routil.redirect(req, res, "/posts")
    }
}