A blog that's  running on node.js.

This is a learning experience for me.

I will use this code to run a blog at http://www.raynos.org

## Vague cloning instructions.

Warning: Refactoritis. It's not done yet. 75% done

Fork / clone the code. 

`$ npm link`

Make sure your using node 0.6.x (only tested on 0.6.x

Set process environments like the PORT, COUCH_USER & COUCH_PWD

    $ export PORT=4000
    $ export COUCH_USER=root
    $ export COUCH_PWD=nice_try
    
Change [data Model][1] to point at your own CouchDB database.

You can set one up at iriscouch.com, Make sure to turn off admin party through futon

You can access futon by "http://url.iriscouch.com/_utils/" (but you can't access mine). 

You will need to create a database to store your data. I named mine "posts"

Apart from setting permissions, user accounts & creating the database couchDB should be good to go.
  
  [1]: https://github.com/Raynos/raynos-blog/blob/master/src/data/model.js#L7