var routil = require("routil"),
    validate = require("validate")

var GetSchema = {
    postId: {
        required: true,
        type: "string"
    }
}

var self = module.exports = routil.methods({
    "GET": getPost
})

function getPost(req, res, params) {
    var sanitized = validate(GetSchema, params)
    if (Array.isArray(sanitized)) {
        return routil.errorPage(req, res, [500, sanitized[0]])
    }

    self.domain.getPost(sanitized.postId, renderPost)

    function renderPost(err, post) {
        if (err) {
            return routil.errorPage(req, res, [500, err])
        }

        routil.mediaTypes(req, res, {
            "application/json": function  () {
                routil.sendJson(res, post)
            },
            default: function () {
                routil.template("/posts/view.ejs", post)
            }
        })()
    }
}