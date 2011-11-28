var inputs = load("auth/inputs", data);
var form = frag.firstChild;

var ul = form.getElementsByTagName("ul")[0];
var li = ul.getElementsByTagName("li")[1];
ul.insertBefore(inputs, li);

var body = frag.ownerDocument.body;
var section = body.getElementsByTagName("section")[0];
section.id = "auth";


/*
	{?password_notsame}
		class="error"
		title="{password_notsame}"
	{:else}
		title="please confirm your password" 
	{/password_notsame}

	{?email_invalid}
		class="error"
		title="{email_invalid}"
	{:else}
*/