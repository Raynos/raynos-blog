var routil = require("routil")

module.exports = {
    setup: function () {
        this.server.on("created", this.attachRequestHandler)
    },
    attachRequestHandler: function (server) {
        server.on("request", this.handleRequest)
    },
    handleRequest: function (req, res) {
        var route = this.router.match(req.url)
        if (!route) {
            return routil.errorPage(req, res, 404)
        } 

        route.fn(req, res, route.params, route.splats)
    }
}