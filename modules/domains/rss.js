module.exports = {
    setup: function () {
        this.posts = this.domains.posts
    },
    getPosts: function (callback) {
        this.posts.getAllPosts(callback)
    }
}