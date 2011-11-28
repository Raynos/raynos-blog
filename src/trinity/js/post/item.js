var article = frag.firstChild;
var a = article.getElementsByTagName("a")[0];
a.href = "/blog/" + data.url;
a.textContent = data.title;

var time = article.getElementsByTagName("time")[0];
time.datetime = data.datetime;
time.textContent = data.readable_time;

var div = article.getElementsByTagName("div")[0];
div.innerHTML = data.content;