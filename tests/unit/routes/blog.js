var blog = require("../../../modules/routes/blog"),
    assert = require("assert"),
    sinon = require("sinon")

describe("routes blog", function () {
    it("should add a route when setup", function () {
        var controller = {},
            addRouteSpy = sinon.spy()

        blog.router = {
            addRoute: addRouteSpy
        }
        blog.controller = controller
        blog.setup()

        assert(addRouteSpy.calledOnce, "addRoute was not called")
        assert(addRouteSpy.calledWith("/blog", controller),
            "blog did not add the controller under the /blog route")
    })
})