var Model = require("./model.js"),
    pd = require("pd");

var UserModel = pd.make(Model,{
    start: function _start() {
        this.nano = this.nano.use("_users");
        this.emit("loaded");
    }
});

UserModel.constructor();

module.exports = UserModel;