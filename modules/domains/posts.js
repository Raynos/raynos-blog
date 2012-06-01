module.exports = {
    setup: function () {
        this.collection = this.dataSources.posts
    },
    getAllPosts: function (callback) {
        this.collection.getAll(callback)
    },
    getPost: function (id, callback) {
        this.collection.getPost(id, callback)
    },
    createPost: function (data, callback) {
        this.collection.createPost(data, callback)
    }
}