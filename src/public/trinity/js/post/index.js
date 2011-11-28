var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";
var form = frag.firstChild;

if (!data.user) {
	frag.removeChild(form);
}

data.forEach(function (post, index) {
	var itemFrag = load("post/item", post);
	var article = itemFrag.firstChild;
	var footer = load("post/item-footer", post);
	article.appendChild(footer);
	frag.appendChild(article);
	if (index !== data.length - 1) {
		frag.appendChild(document.createElement("hr"));	
	}
});