var PostCollection = require("mongo-col")("Posts"),
    DEFAULT_OPTIONS = { 
        safe: true
    }

module.exports = {
    getAll: function (callback) {
        PostCollection.find({}).toArray(callback)
    },
    getPost: function (_id, callback) {
        PostCollection.findOne({
            _id: _id
        }, callback)
    },
    createPost: function (data, callback) {
        PostCollection.insert(data, DEFAULT_OPTIONS, callback)
    }
}