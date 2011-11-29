var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";
var form = frag.firstChild;
var link = frag.childNodes[2];

if (!data.user) {
	frag.removeChild(form);
}

data.forEach(function (post, index) {
	var itemFrag = load("post/item", post);
	var article = itemFrag.firstChild;
	var footer = load("post/item-footer", post);
	article.appendChild(footer);
	frag.insertBefore(article, link);
	if (index !== data.length - 1) {
		frag.insertBefore(document.createElement("hr"), link);	
	}
});