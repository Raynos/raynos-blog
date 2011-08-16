var markdown = require("markdown").markdown;

module.exports = {
	// common code
	"_view": function _view(p) {
		p = this.fixURL(p);
		p.readable_time = new Date(p.datetime).toDateString()
		return p;
	},
	// create the index view
	"index": function _index(p) {
		p = this._view(p)
		var tree = markdown.toHTMLTree(p.content);
		p.content = markdown.toHTML(tree.slice(0, 3));
		return p;
	},
	// return an url
	"url": function _createURL(p) {
		return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
	},
	// normalize the document & fix the url
	"fixURL": function _fixURL(p) {
		p = (p[0] || p).value;
		p.url = this.url(p);
		return p;
	},
	// create the show view
	"show": function _show(p) {
		p = this._view(p);
		p.content = markdown.toHTML(p.content);
		return p;
	}
}