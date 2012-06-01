var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";

var editForm = frag.firstChild;
var deleteForm = frag.childNodes[2];

if (data.user) {
	editForm.action="/blog/" + data.id + "/edit";
	deleteForm.action="/blog/" + data.id;	
} else {
	frag.removeChild(editForm);
	frag.removeChild(deleteForm);
}

var articleFrag = load("post/item", data);
var article = articleFrag.firstChild;
frag.appendChild(article);