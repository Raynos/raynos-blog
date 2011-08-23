module.exports = {
	"_flash": function _flash(flash, data) {
		data = data || {};
		Object.keys(flash).forEach(function(key) {
			data[key] = flash[key];
		});
		return data;
	}
};