module.exports = {
    getAllPosts: function (callback) {
        this.dataSource.getAllPosts(callback)
    },
    getPost: function (id, callback) {
        this.dataSource.getPost(id, callback)
    },
    createPost: function (data, callback) {
        this.dataSource.createPost(data, callback)
    },
    updatePost: function (id, body, callback) {
        this.dataSource.updatePost(id, body, callback)
    },
    deletePost: function (id, callback) {
        this.dataSource.deletePost(id, returnCorrectError)

        function returnCorrectError(err, updated) {
            if (err) {
                return callback(err)
            } else if (updated === 0) {
                return callback(new Error("post not deleted"))
            }

            callback(err, updated)
        }
    }
}