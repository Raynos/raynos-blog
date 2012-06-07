module.exports = {
    setup: function () {
        var router = this.router,
            controller = this.controller

        router.addRoute("/session", controller)
    }
}