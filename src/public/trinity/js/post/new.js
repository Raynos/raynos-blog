var document = frag.ownerDocument,
	section = document.body.getElementsByTagName("section")[0];

section.id = "blog";

var ulFrag = load("post/item_form", data);
var ul = ulFrag.firstChild;

var form = frag.firstChild;
var fieldset = form.childNodes[1];
var legend = fieldset.childNodes[1];
fieldset.insertBefore(ul, legend);