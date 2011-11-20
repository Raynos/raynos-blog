var Model = require("./model.js"),
	pd = require("pd");

var PostModel = pd.make(Model, {
    start: function _start() {
        this.nano = this.nano.use("posts");
        this.emit("loaded");
    }
});

PostModel.constructor();

module.exports = PostModel;