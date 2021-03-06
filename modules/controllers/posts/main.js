var routil = require("routil"),
    validate = require("validate")

var PostSchema = {
    title: {
        required: true,
        type: 'string'
    },
    content: {
        required: true,
        type: 'string'
    }
}

var self = module.exports = routil.methods({
    "GET": showPosts,
    "POST": addPost
})

function showPosts(req, res) {
    self.domain.getAllPosts(renderPosts)

    function renderPosts(err, posts) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.mediaTypes(req, res, {
            "application/json": function () {
                routil.sendJson(res, posts)
            },
            default: function () {
                routil.template(req, res, "posts/main.ejs", {
                    posts: posts
                })
            }
        })()
    }
}

function addPost(req, res) {
    routil.formBody(req, res, sanitizeBody)

    function sanitizeBody(data) {
        var sanitized = validate(PostSchema, data)
        if (Array.isArray(sanitized)) {
            return routil.errorPage(req, res, sanitized[0])
        }

        self.domain.createPost(sanitized, renderPost)
    }

    function renderPost(err, posts) {
        if (err) {
            return routil.errorPage(req, res, err)
        }
        routil.redirect(req, res, "/posts/" + posts[0]._id)
    }
}