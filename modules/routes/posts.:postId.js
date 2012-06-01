var routil = require("../../lib/routil"),
    accept = require("acceptance").accept

var GetSchema = {
    postId: {
        required: true
    }
}

module.exports = {
    setup: function () {
        this.domain = this.domains.posts
        this.router.addRoute("/posts/:postId", routil.methods({
            "GET": this.showPost
        }))
    },
    showPost: function (req, res, params) {
        var sanitized = accept(params, GetSchema)
        if (sanitized.error) {
            return routil.errorPage(req, res, [500, sanitized.error[0]])
        }
        sanitized = sanitized.accepted

        this.domain.getPost(sanitized.postId, renderPost)

        function renderPost(err, post) {
            if (err) {
                return routil.errorPage(req, res, [500, err])
            }

            routil.template("/posts/view.ejs", post)
        }
    }
}