var mapleTree = require("mapleTree")
    , routes = require("./routes")
    , forEach = require("iterators").forEachSync
    , router = new mapleTree.RouteTree()

forEach(routes, function (value, key) {
    router.define(key, require(value))
})

module.exports = router