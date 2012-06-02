var EventEmitter = require("events").EventEmitter.prototype,
    bindAll = require("bindAll"),
    server = require("../../modules/server"),
    assert = require("assert")

bindAll(server, EventEmitter)

describe("server", function () {
    it("should create a server when set up", function () {
        server.setup()
        assert(server.server, "server does not have a server")
    })

    it("should emit a server creation event when initialized", 
        function (done) {
            server.once("created", function (server) {
                assert(server, "server is not created")
            })
            server.once("listening", function () {
                server.server.on("close", done)
                server.server.close()
            })
            server.setup()
            server.init()
        })

    it("should emit a listening event when initialized", function (done) {
        server.once("listening", function (port) {
            assert.equal(port, 8080, "port is incorrect")
            server.server.on("close", done)
            server.server.close()
        })
        server.setup()
        server.init()
    })
})