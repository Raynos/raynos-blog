var posts = require("../../../modules/routes/posts"),
    assert = require("assert"),
    sinon = require("sinon")

describe("routes posts", function () {
    it("should add routes when setup", function () {
        var main = {},
            _new = {},
            item = {},
            edit = {},
            controller = {
                main: main,
                new: _new,
                item: item,
                edit: edit
            },
            addRouteSpy = sinon.spy()

        posts.router = {
            addRoute: addRouteSpy
        }
        posts.controller = controller
        posts.setup()

        assert.equal(addRouteSpy.callCount, 4, 
            "addRoute was not called four times")
        assert(addRouteSpy.calledWith("/posts", main),
            "posts did not add the correct controller under the /posts route")
        assert(addRouteSpy.calledWith("/posts/new", _new),
            "posts did not set the correct controller for /posts/new")
        assert(addRouteSpy.calledWith("/posts/:postId/:title?", item),
            "posts did not set the correct controller for /posts/:postId")
        assert(addRouteSpy.calledWith("/posts/:postId/edit", edit),
            "posts did not set the correct controller for /posts/:postId/edit")
    })
})