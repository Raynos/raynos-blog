# Raynos-Blog

A blog that's running on node.js.

This is a learning experience for me.

I will use this code to run a blog at http://www.raynos.org

## Status: running in production but still beta

## Architecture overview

 - /tests/unit contains unit tests
 - /tests/http contains HTTP level integration tests
 - /tests/zombie contains HTML forms tests

The architecture is build on ncore and the [depencencies][1] are shown.

 - routes register HTTP uris on the router
 - controllers implement HTTP logic for a particular uri
 - domains implement domain logic
 - dataSources abstract database interactions

### HTTP flow

A http request comes and the router is called to return a single controller 
based on the uri.

The controller function is invoked and does logic including calls to domains.

Routil is used to do req/res manipulation utilities and to minimize the amount
of common code that is run for every single request.
  
  [1]: https://github.com/Raynos/raynos-blog/blob/master/dependencies.json