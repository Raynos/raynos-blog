var marked = require("marked");

module.exports = {
	index: function _index(posts) {
		return posts.map(makePost, this);

		function makePost(post) {
			post.content = twoParagraphs(post.content);
			this.makePost(post);
			return post;
		}
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
		return post;
	}
};

function twoParagraphs(str) {
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
}