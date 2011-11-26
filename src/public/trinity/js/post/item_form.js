var ul = frag.firstChild;

if (data) {
	ul.getElementsByTagName("input")[0].value = data.title;

	ul.getElementsByTagName("textarea")[0].textContent = data.content;	
}

