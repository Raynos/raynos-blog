var inputs = load("auth/inputs", data);
var form = frag.firstChild;

var ul = form.getElementsByTagName("ul")[0];
var li = ul.getElementsByTagName("li")[0];
ul.insertBefore(inputs, li);

var body = frag.ownerDocument.body;
var section = body.getElementsByTagName("section")[0];
section.id = "auth";