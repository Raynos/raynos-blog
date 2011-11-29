var PostModel = require("../data/post.js"),
	Domain = require("./domain.js"),
	Validator = require("../util.js").Validator,
	pd = require("pd");

var Post = PostModel.make(Domain, {
	constructor: function _constructor(obj) {
		pd.extend(this, obj);
		this.id = this._id.split(":")[1];
	},
	construct: function _construct(post, cb) {
		var that = this;

		function createObject(err, id) {
			var obj = {
				title: post.title,
				content: post.content,
				id: id,
				_id: that.prefix + id,
				datetime: Date.now(),
				type: "post"
			}

			that.create(obj, cb);
		}

		this.nextId(createObject);
	},
	validate: function _validate(post) {
		var v = Object.create(Validator);
		v.check(post.content, 
			"content field should not be empty").len(1);
		v.check(post.title, 
			"title field should not be empty").len(1);
		if (v.errors && v.errors.length) {
			return v.errors;
		}
	},
	Model: PostModel
});

module.exports = Post;