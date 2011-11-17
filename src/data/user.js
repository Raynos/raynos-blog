var Model = require("./model.js"),
    error = require("error"),
    pd = require("pd");

var whitelistMap = {
    "get": ["not_found"],
    "insert": ["conflict"],
    "delete": []
}

function makeWhitelistCallback(method, thing, cb) {
    return error.whitelist(function _errors(err) {
        if (err.syscall === "getaddrinfo") {
            UserModel[method](thing, cb);
        } else if (whitelistMap[method].indexOf(err.error) !== -1) {
            return true;
        } else {
            return false;
        }
    }, cb);
}

var UserModel = pd.make(Model,{
    get: function _get(id, cb) {
        this.nano.get(id, 
            makeWhitelistCallback("get", id, cb)
        );
    },
    insert: function _create(json, cb) {
        this.nano.insert(json, json._id, 
            makeWhitelistCallback("insert", json, cb)
        );
    },
    delete: function _delete(name, cb) {
        var that = this;
        this.get(name, function _getRev(err, body) {
            that.nano.destroy(name, body._rev, 
                makeWhitelistCallback("delete", name, cb)
            );
        });
    }
});

UserModel.on("start", function () {
    UserModel.constructor();
    UserModel.nano = UserModel.nano.use("_users");
    UserModel.emit("loaded");
});

module.exports = UserModel;