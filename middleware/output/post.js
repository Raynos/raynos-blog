var Trait = require("traits").Trait,
	Base = require("./base.js"),
	marked = require("marked");

var twoParagraphs = function(str) {
	var tokens = marked.lexer(str), 
		paragraphs = 0;

	for (var i = 0, ii = tokens.length; i < ii; i++) {
		var token = tokens[i];
		if (token.type !== 'text') {
			if (token.type === 'space') {
				if (++paragraphs === 2) {
					break;
				}
			} else {
				break;
			}
		}
	}
	
	tokens.length = i;

	return marked.parser(tokens);
};

module.exports = Object.create(Object.prototype, Trait.compose(Trait({
	"_url": function _createURL(p) {
		return p.id + "/" + encodeURIComponent(p.title.replace(/\s/g, "-"));
	},
	// fix the url
	"_fixURL": function _fixURL(p) {
		p.url = this._url(p);
		return p;
	},
	"_view": function _view(p) {
		p = this._fixURL(p);
		p.readable_time = new Date(p.datetime).toDateString();
		return p;
	},
	"_index": function _index(p) {
		p = p.rows;
		p = p.map((function (val) {
			val = val.value;
			val = this._view(val);
			val.content = twoParagraphs(val.content);
			return val;
		}).bind(this));
		return p;
	},
	"show": function _show(p) {
		p = this._view(p);
		p.content = marked(p.content);
		return p;
	},
	"renderPosts": function _renderPosts(req, res) {
		res.render("blog/index", {
			"posts": this._index(req.posts)
		});
	},
	"renderNewPostForm": function _new(req, res) {
		res.render("blog/new", req.flash());
	},
	"renderPostEditForm": function _edit(req, res, next) {
		var locals = this._fixURL(req.post);
		res.render("blog/edit", this._flash(req.flash(), locals));	
	},
	"renderPost": function _show(req, res, next) {
		res.render("blog/show", this._show(req.post));
	},
	"redirectToPost": function _redirectToPost(req, res, next) {
		res.redirect("/blog/" + this._url(req.post));
	},
	"redirectToBlog": function _redirectToBlog(req, res, next) {
		res.redirect("/blog");
	}
}), Trait(Base)));