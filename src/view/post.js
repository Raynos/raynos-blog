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

function fixUrl(post) {
	post.url = post.id + "/" + encodeURIComponent(post.title.replace(/\s/g, "-"));
}


module.exports = {
	index: function _index(posts) {
		return posts.map(function (post) {
			post.content = twoParagraphs(post.content);
			post.readable_time = new Date(post.datetime).toDateString();
			fixUrl(post);
			return post;
		}).reverse();
	}
}