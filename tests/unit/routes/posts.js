var posts = require("../../../modules/routes/posts"),
    assert = require("assert"),
    sinon = require("sinon")

describe("routes posts", function () {
    it("should add routes when setup", function () {
        var main = {},
            _new = {},
            postId = {},
            controller = {
                main: main,
                new: _new,
                ":postId": postId
            },
            addRouteSpy = sinon.spy()

        posts.router = {
            addRoute: addRouteSpy
        }
        posts.controller = controller
        posts.setup()

        assert(addRouteSpy.calledThrice, "addRoute was not called three times")
        assert(addRouteSpy.calledWith("/posts", main),
            "posts did not add the correct controller under the /posts route")
        assert(addRouteSpy.calledWith("/posts/new", _new),
            "posts did not set the correct controller for /posts/new")
        assert(addRouteSpy.calledWith("/posts/:postId", postId),
            "posts did not set the correct controller for /posts/:postId")
    })
})