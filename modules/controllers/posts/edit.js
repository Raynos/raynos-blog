var routil = require("routil"),
    validate = require("validate")

var self = module.exports = routil.methods({
    "GET": viewEditPage
})

function viewEditPage(req, res, params) {
    self.domain.getPost(params.postId, renderEditPage)

    function renderEditPage(err, post) {
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

        routil.template(req, res, "posts/edit.ejs", 
            self.viewModel.viewOneRaw(post))
    }
}