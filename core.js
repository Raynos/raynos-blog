var core = require("ncore/modules/core")

if (module.parent) {
    module.exports = invokeCore
} else {
    core()
}

function invokeCore(cb) {
    core({}, cb)    
}
