var marked = require("marked"),
    whitespace = /\s/g

module.exports = {
    viewAll: function (posts) {
        return posts.map(viewAllPost)
    },
    viewOne: function (post) {
        post.content = marked(post.content)
        return writeTimeAndUrl(post)
    },
    viewOneRaw: function (post) {
        return writeTimeAndUrl(post)
    }
}

function viewAllPost(post) {
    post.content = marked(post.content)
    return writeTimeAndUrl(post)
}

function writeTimeAndUrl(post) {
    post.readable_time = new Date(post.datetime).toDateString()
    post.url = createUrl(post)
    return post
}

function createUrl(post) {
    return "/posts/" + post._id.toString() + "/" + encodeURIComponent(
        post.title.replace(whitespace, "-"))
}