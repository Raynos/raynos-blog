var markdown = require("markdown").markdown;

module.exports = {
	"_view": function _view(p) {
		p = this.fixURL(p);
		p.readable_time = new Date(p.datetime).toDateString()
		return p;
	},
	"index": function _index(p) {
		p = this._view(p)
		p.content = markdown.toHTML(p.content);
		return p;
	},
	"url": function _createURL(p) {
		return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
	},
	"fixURL": function _fixURL(p) {
		p = (p[0] || p).value;
		p.url = this.url(p);
		return p;
	},
	"show": function _show(p) {
		p = this._view(p);
		p.content = markdown.toHTML(p.content);
		return p;
	}
}