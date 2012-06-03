var DEFAULT_OPTIONS = { 
        safe: true
    },
    ObjectID = require("mongodb").ObjectID

var PostDefinition = {
    _id: ObjectID,
    title: String,
    content: String,
    datetime: Number
}

module.exports = {
    setup: function () {
        this.collection = this.mongodb("Posts")
    },
    getAllPosts: function (callback) {
        this.collection.find().toArray(callback)
    },
    getPost: function (_id, callback) {
        try {
            var id = ObjectID(_id)
        } catch (err) {
            return callback(err)
        }

        this.collection.findOne({
            _id: id
        }, callback)
    },
    createPost: function (data, callback) {
        this.collection.insert(data, DEFAULT_OPTIONS, callback)
    },
    updatePost: function (_id, body, callback) {
        try {
            var id = ObjectID(_id)    
        } catch (err) {
            return callback(err)
        }
        

        this.collection.update({
            _id: id
        }, {
            $set: body
        }, {
            safe: true,
            upsert: true
        }, callback)
    },
    deletePost: function (_id, callback) {
        try {
            var id = ObjectID(_id)
        } catch (err) {
            return callback(err)
        }

        this.collection.remove({
            _id: id
        }, DEFAULT_OPTIONS, callback)
    }
}