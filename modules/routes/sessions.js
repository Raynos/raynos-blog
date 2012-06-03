module.exports = {
    setup: function () {
        var router = this.router,
            controller = this.controller

        router.addRoute("/sessions", controller.main)
        router.addRoute("/sessions/new", controller.new)
        router.addRoute("/sessions/:sessionId", controller.item)
    }
}