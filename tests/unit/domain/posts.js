var posts = require("../../../modules/domains/posts"),
    assert = require("assert"),
    sinon = require("sinon")

describe("domains posts", function () {
    var getAllPosts = sinon.spy(),
        getPost = sinon.spy()
        createPost = sinon.spy(),
        updatePost = sinon.spy(),
        deletePost = sinon.spy(),
        token = {},
        token2 = {},
        token3 = {}

    posts.dataSource = {
        getAllPosts: getAllPosts,
        getPost: getPost,
        createPost: createPost,
        updatePost: updatePost,
        deletePost: deletePost
    }

    it("should call dataSource when getAllPosts is called", function () {
        posts.getAllPosts(token)

        assert(getAllPosts.calledOnce, "getAllPosts was not called")
        assert(getAllPosts.calledWith(token),
            "getAllPosts was not called correctly")
    })

    it("should call dataSource when getPost is called", function () {
        posts.getPost(token, token2)

        assert(getPost.calledOnce, "getPost was not called")
        assert(getPost.calledWith(token, token2),
            "getPost was not called correctly")
    })

    it("should call dataSource when createPost is called", function () {
        posts.createPost(token, token2)

        assert(createPost.calledOnce, "createPost was not called")
        assert(createPost.calledWith(token, token2),
            "createPost was not called correctly")
    })

    it("should call dataSource when updatePost is called", function () {
        posts.updatePost(token, token2, token3)

        assert(updatePost.calledOnce, "updatePost was not called")
        assert(updatePost.calledWith(token, token2, token3),
            "updatePost was not called correctly")
    })

    it("should call dataSource when deletePost is called", function() {
        posts.deletePost(token, token2)

        assert(deletePost.calledOnce, "deletePost was not called")
        assert(deletePost.calledWith(token, token2),
            "deletePost was not called correctly")
    })
})