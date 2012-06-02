module.exports = {
    setup: function () {
        var router = this.router,
            controller = this.controller

        router.addRoute("/posts", controller.main)
        router.addRoute("/posts/new", controller.new)
        router.addRoute("/posts/:postId", controller[":postId"])
    }
}