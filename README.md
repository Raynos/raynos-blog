A blog that's running on node.js.

This is a learning experience for me.

I will use this code to run a blog at http://www.raynos.org

## Vague cloning instructions.

Fork / clone the code. 

`$ npm link`

Make sure your using node 0.6.3 (only tested on 0.6.3)

I have a Makefile that looks like

	env:
        export PORT=8000
        export COUCH_USER=root # couch user
        export COUCH_PWD=<strip> # couch password
        export USER_PWD=<strip> # unit test login password. 

	start:
        node src/server.js > out.log &

	test:
	    nodeunit test/http

	.PHONY: env start test

Change [data Model][1] to point at your own CouchDB database.

You can set one up at iriscouch.com, Make sure to turn off admin party through futon

You can access futon by "http://url.iriscouch.com/_utils/" (but you can't access mine). 

You will need to create a database to store your data. I named mine "posts"

You will also need to create a login user in the _users database. You will probably also want to change the [beRaynos][2] rule

Apart from setting permissions, user accounts & creating the database couchDB should be good to go.
  
  [1]: https://github.com/Raynos/raynos-blog/blob/4be2309c5de824e8e4b377d635136e612ee6c74b/src/data/model.js#L47
  [2]: https://github.com/Raynos/raynos-blog/blob/dcf6c4837b47b4f70edeec8ace648ad97b102f25/src/controllers/post.js#L94