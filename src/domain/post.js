var PostModel = require("../data/post.js"),
	Domain = require("./domain.js"),
	Validator = require("../util.js").Validator,
	pd = require("pd");

var Post = pd.make(Domain, {
	make: function _make(obj) {
		var post = Object.create(Post);
		pd.extend(post, obj);
		post.id = post._id.split(":")[1];
		return post;
	},
	create: function _create(post, cb) {
		var that = this;

		function handleAll(err, data) {
			var rows = data.rows;
			
			var id = rows.reduce(function (memo, item) {
				var id = +item.id.split(":")[1];
				return id > memo ? id : memo;
			}, 0);
			id++;


			var obj = {
				title: post.title,
				content: post.content,
				id: id,
				_id: that.prefix + id,
				datetime: Date.now(),
				type: "post"
			}

			PostModel.insert(obj, handleInsert);
		}

		function handleInsert(err, post) {
			PostModel.get(post.id, handleGet);
		}

		function handleGet(err, post) {
			cb(null, that.make(post));
		}

		PostModel.all(handleAll);
	},
	update: function _update(id, post, cb) {
		var that = this;
		post._id = this.prefix + id;

		function _handleGetForRev(err, data) {
			post._rev = data._rev;
			PostModel.insert(post, _handleInsert);	
		}

		function _handleInsert(err, post) {
			PostModel.get(post.id, _handleGetForCb);
		}

		function _handleGetForCb(err, post) {
			cb(null, that.make(post));
		}

		this.get(id, _handleGetForRev);
		
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
	prefix: "post:",
	Model: PostModel
});

module.exports = Post;