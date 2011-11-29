var data2xml = require("data2xml").data2xml,
	Post = require("../domain/post.js"),
	PostViewModel = require("../viewmodels/post.js");

module.exports = {
	home: home,
	rss: rss
};

function home(req, res) {
	res.redirect("/blog/");
}

function rss(req, res) {
	Post.all(all);

	function all(err, posts) {
		var data = {
			_attr: { version: "2.0" },
			channel: {
				title: "Raynos Blog",
				description: "Node and JavaScript blog of jawesome",
				link: "http://raynos.org/blog",
				item: PostViewModel.index(posts).map(convertToItem)
			}
		};

		var xml = data2xml('rss', data);

		res.contentType('rss');
		res.send(xml);
	}
}

function convertToItem(post) {
	return {
		title: post.title,
		description: post.content,
		link: "http://raynos.org/blog/" + post.url,
		guid: "http://raynos.org/blog/" + post.url,
		pubDate: post.readable_time
	};		
}