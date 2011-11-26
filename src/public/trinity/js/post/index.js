var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";
var form = frag.firstChild;

data.forEach(function (post) {
	var itemFrag = load("post/item", post);
	var article = itemFrag.firstChild;
	var footer = load("post/item-footer", post);
	article.appendChild(footer);
	frag.insertBefore(article, form);
	frag.insertBefore(document.createElement("hr"), form);
});