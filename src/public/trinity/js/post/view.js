var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";

var editForm = frag.firstChild;

editForm.action="/blog/" + data.id + "/edit";

var deleteForm = frag.childNodes[2];

deleteForm.action="/blog/" + data.id;

var articleFrag = load("post/item", data);
var article = articleFrag.firstChild;
frag.insertBefore(article, editForm);