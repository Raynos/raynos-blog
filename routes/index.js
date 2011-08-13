var fs = require("fs");

module.exports = function(app) {
	var files = fs.readdirSync(__dirname);
	files.forEach(function(v) {
		if (v !== "index.js") {
			require("./" + v)(app);
		}
	});
};