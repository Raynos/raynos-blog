var ErrorPage = require("error-page")
    , ejs = require("ejs")
    , path = require("path")
    , slice = Array.prototype.slice
    , Templar = require("templar")

var errorPageConfig = {
        /*TODO */
    }
    , templarConfig = {
        engine: ejs
        , folder: path.join(__dirname, "templates")
    }

module.exports = {
    error: error
    , template: template
}

function error(req, res) {
    var rest = slice.call(arguments, 2)
        , errorPage = ErrorPage(req, res, errorPageConfig)

    return errorPage.apply(null, rest)
}

function template(req, res, name, data) {
    Templar(req, res, templarConfig)(name, data || {})
}