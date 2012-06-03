module.exports = {
    getAllPosts: function (callback) {
        this.dataSource.getAllPosts(callback)
    },
    getPost: function (id, callback) {
        this.dataSource.getPost(id, callback)
    },
    createPost: function (data, callback) {
        this.dataSource.createPost(data, callback)
    }
}