module.exports = {
	"flash": function _flash(flash, data) {
		Object.keys(flash).forEach(function(key) {
			data[key] = flash[key];
		});
		return data;
	}
};