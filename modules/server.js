var http = require("http"),
    debug = require("debug")("http")

module.exports =  {
    port: process.env.PORT || 8080,
    setup: function () {
        var server = this.server = http.createServer()
    },
    init: function () {
        var server = this.server
        this.emit("created", server)
        server.listen(this.port, this.onListen)
        debug("server listening on port: ", this.port)
    },
    onListen: function () {
        this.emit("listening", this.port)
    }
}