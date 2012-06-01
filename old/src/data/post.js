var Model = require("./model.js"),
	pd = require("pd");

var PostModel = Model.make({
    start: function _start() {
        this.nano = this.nano.use("posts");
        this.emit("loaded");
    },
    prefix: "post:"
});

PostModel.constructor();

module.exports = PostModel;