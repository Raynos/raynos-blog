var core = require("ncore")

if (module.parent) {
    module.exports = invokeCore
} else {
    core()
}

function invokeCore(cb) {
    core({}, cb)    
}
