var http = require("http")
    , router = require("./router")
    , routil = require("./routil")
    , PORT = process.env.PORT || 8080

module.exports = handleRequest

if (require.main === module) {
    var server = http.createServer(handleRequest).listen(PORT, started)
}

function handleRequest(req, res) {
    var match = router.match(req.url)
    if (match && match.fn) {
        match.fn(req, res, match.params)
    } else {
        routil.error(req, res, 404)
    }
}

function started() {
    console.log("Listening on port", server.address().port)
}