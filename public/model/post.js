var Model = require("LazyBoy");

var Post = Model.define("blog_post", {
	"content": String,
	"title": String,
	"datetime": Number,
	"url": String
});

Post.beforeCreate(function(p) {
	p.url = p.title.split(" ").join("-");
});