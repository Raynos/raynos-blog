var home = require("../../../modules/routes/home"),
    assert = require("assert"),
    sinon = require("sinon")

describe("routes home", function () {
    it("should add a route when setup", function () {
        var controller = {},
            addRouteSpy = sinon.spy()

        home.router = {
            addRoute: addRouteSpy
        }
        home.controller = controller
        home.setup()

        assert(addRouteSpy.calledOnce, "addRoute was not called")
        assert(addRouteSpy.calledWith("/", controller),
            "home did not add the controller under the / route")
    })
})