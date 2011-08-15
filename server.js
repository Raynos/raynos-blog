var express = require('express'),
	init = require("./app-init.js");

var app = module.exports = express.createServer();

if (!module.parent) {
	init(app);
}




