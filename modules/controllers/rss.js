var routil = require("routil")

var self = module.exports = routil.methods({
    "GET": getRss
})

self.setup = function () {
    self.domain = self.domains.posts
}

function getRss(req, res) {
    self.domain.getAllPosts(returnRSS)

    function returnRSS(err, posts) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.send(res, self.viewModel.createXml(posts), 200, {
            "content-type": "application/rss+xml"
        })
    }
}