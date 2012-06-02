var mongoCol = require("mongo-col"),
    database

if (process.env.NODE_ENV === "test") {
    database = "raynos-blog-test"
} else {
    database = "raynos-blog"
}

module.exports = getCollection

getCollection.setup = setup

function getCollection(name) {
    return mongoCol(name, database)
}

function setup(done) {
    mongoCol("Posts", database, done)
}