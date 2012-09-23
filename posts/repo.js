var collection = require("mongo-col")
    , Posts = collection("posts")

module.exports = {
    allPosts: allPosts
}

function allPosts(callback) {
    Posts.find({
        __deleted__: {
            $exists: false
        }
    }).toArray(callback)
}