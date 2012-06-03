var routil = require("routil")

var self = module.exports = routil.methods({
    "GET": getRss
})

function getRss(req, res) {
    self.domain.getPosts(returnRSS)

    function returnRSS(err, posts) {
        if (err) {
            return routil.errorPage(req, res, err)
        }

        routil.send(res, self.viewModel.createXml(posts), 200, {
            "content-type": "application/rss+xml"
        })
    }
}