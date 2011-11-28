var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";

var form = frag.firstChild;

form.action = "/blog/" + data.id;

var ulFrag = load("post/item_form", data);
var ul = ulFrag.firstChild;

var fieldset = form.childNodes[1];

fieldset.appendChild(ul);