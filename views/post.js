var markdown = require("markdown").markdown,
	marked = require("marked");

module.exports = {
	// common code
	"_view": function _view(p) {
		p = this.fixURL(p);
		p.readable_time = new Date(p.datetime).toDateString()
		return p;
	},
	"flash": function _flash(flash, data) {
		data = data || {};
		Object.keys(flash).forEach(function(key) {
			data[key] = flash[key];
		});
		return data;
	},
	// create the index view
	"index": function _index(p) {
		var p = p.rows;
		p = p.map((function (val) {
			val = val.value;
			val = this._view(val);
			var tree = markdown.toHTMLTree(val.content);
			val.content = markdown.toHTML(tree.slice(0, 3));
			return val;
		}).bind(this));
		return p;
	},
	// return an url
	"url": function _createURL(p) {
		return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
	},
	// fix the url
	"fixURL": function _fixURL(p) {
		p.url = this.url(p);
		return p;
	},
	// create the show view
	"show": function _show(p) {
		p = this._view(p);
		p.content = marked(p.content);
		return p;
	}
}