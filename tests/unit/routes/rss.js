var rss = require("../../../modules/routes/rss"),
    assert = require("assert"),
    sinon = require("sinon")

describe("routes home", function () {
    it("should add a route when setup", function () {
        var controller = {},
            addRouteSpy = sinon.spy()

        rss.router = {
            addRoute: addRouteSpy
        }
        rss.controller = controller
        rss.setup()

        assert(addRouteSpy.calledOnce, "addRoute was not called")
        assert(addRouteSpy.calledWith("/rss", controller),
            "rss did not add the controller under the /rss route")
    })
})