var DEFAULT_OPTIONS = { 
        safe: true
    },
    ObjectID = require("mongodb").ObjectID

module.exports = {
    setup: function () {
        this.collection = this.mongodb("Posts")
    },
    getAll: function (callback) {
        this.collection.find({}).toArray(callback)
    },
    getPost: function (_id, callback) {
        this.collection.findOne({
            _id: ObjectID(_id)
        }, callback)
    },
    createPost: function (data, callback) {
        this.collection.insert(data, DEFAULT_OPTIONS, callback)
    }
}