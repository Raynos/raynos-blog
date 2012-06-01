if (data.errors) {
	var error = data.errors[0];
}

var usernameInput = frag.firstChild.childNodes[1];
if (error && error.error === "not_found") {
	usernameInput.className += " error";
	usernameInput.title = "username or password is incorrect"
};


/*
	{?username_small}
		class="error"
		title="{username_small}"
	{:else}
	{?username_invalid}
		class="error"
		title="{username_invalid}"
	{:else}
	{?username_incorrect}
		class="error"
		title="{username_incorrect}"
	{:else}
	{?username_found}
		class="error"
		title="{username_found}"
	{:else}
		title="Enter your username"
	{/username_found}
	{/username_incorrect}
	{/username_invalid} 
	{/username_small}



	{?password_small}
		class="error"
		title="{password_small}"
	{:else}
		title="Enter your password" 
	{/password_small}

*/