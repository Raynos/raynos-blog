var routil = require("routil"),
    validate = require("validate")

var GetSchema = {
    postId: {
        required: true,
        type: "string"
    }
}

var self = module.exports = routil.methods({
    "GET": viewEditPage
})

function viewEditPage(req, res, params) {
    var sanitized = validate(GetSchema, params)
    if (Array.isArray(sanitized)) {
        return routil.errorPage(req, res, sanitized[0])
    }

    self.domain.getPost(sanitized.postId, renderEditPage)

    function renderEditPage(err, post) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.template(req, res, "posts/edit.ejs", 
            self.viewModel.viewOne(post))
    }
}