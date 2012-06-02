var routil = require("routil"),
    path = require("path"),
    ejs = require("ejs")

module.exports = {
    setup: function () {
        var templatesFolder = path.join(__dirname, "..", "templates")

        routil.config({
            templar: {
                engine: ejs,
                folder: templatesFolder
            }
        })

        routil.Templar.loadFolder(templatesFolder)
    }
}