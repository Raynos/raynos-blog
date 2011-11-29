var Model = require("./model.js"),
    pd = require("pd");

var UserModel = Model.make({
    start: function _start() {
        this.nano = this.nano.use("_users");
        this.emit("loaded");
    },
    prefix: "org.couchdb.user:"
});

UserModel.constructor();

module.exports = UserModel;