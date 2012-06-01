var routil = require("../../lib/routil"),
    accept = require("acceptance").accept

var PostSchema = {
    title: {
        required: true
    },
    content: {
        required: true
    }
}

module.exports = {
    setup: function () {
        this.domain = this.domains.posts
        this.router.addRoute("/posts", routil.methods({
            "GET": this.showPosts,
            "POST": this.addPost
        }))
    },
    showPosts: function (req, res) {
        this.domain.getAllPosts(renderPosts)

        function renderPosts(err, posts) {
            if (err) {
                return routil.errorPage(req, res, [500, err])
            }
            routil.template(req, res, "posts/main.ejs", {
                posts: posts
            })
        }
    },
    addPost: function (req, res) {
        var self = this

        routil.form(req, sanitizedBody)

        function sanitizeBody(data) {
            var sanitized = accept(data, PostSchema)
            if (sanitized.error) {
                return routil.errorPage(req, res, [500, sanitized.error[0]])
            }
            sanitized = sanitized.accepted

            self.domain.createPost(sanitized, renderPost)
        }

        function renderPost(err, post) {
            if (err) {
                return routil.errorPage(req, res, [500, err])
            }

            console.log("post added", post)

            routil.redirect(req, res, "/posts/"+post._id)
        }
    }
}