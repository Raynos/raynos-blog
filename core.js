module.parent ? module.exports = invokeCore : invokeCore()

function invokeCore(cb) {
    require("ncore")({}, cb)    
}