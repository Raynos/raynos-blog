var marked = require("marked");

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

module.exports = {
	index: function _index(posts) {
		return posts.map(function (post) {
			post.content = twoParagraphs(post.content);
			this.makePost(post);
			return post;
		}, this).sort(function (a, b) {
			return +a.id < +b.id ? 1 : -1;
		});
	},
	view: function _view(post) {
		post.content = marked(post.content);
		this.makePost(post);
		return post;
	},
	makeUrl: function _makeUrl(post) {
		return post.id + "/" + encodeURIComponent(post.title.replace(/\s/g, "-"));
	},
	makePost: function _makePost(post) {
		post.readable_time = new Date(post.datetime).toDateString();
		post.url = this.makeUrl(post);
	}
}