var data2xml = require("data2xml"),
    uri = "http://raynos.org"

module.exports =  {
    setup: function () {
        this.posts = this.viewModels.posts
    },
    createXml: function (posts) {
        var data = {
            _attr: { version: "2.0" },
            channel: {
                title: "Raynos Blog",
                description: "Node and JavaScript blog",
                link: uri + "/posts",
                item: this.posts.viewAll(posts).map(convertToItem)
            }
        }

        return data2xml("rss", data)
    }
}

function convertToItem(post) {
    return {
        title: post.title,
        description: post.content,
        link: uri + post.url,
        guid: uri + post.url,
        pubDate: new Date(post.datetime).toISOString()
    }
}