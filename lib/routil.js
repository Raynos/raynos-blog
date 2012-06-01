var ErrorPage = require("error-page"),
    StringDecoder = require("string_decoder").StringDecoder,
    Negotiator = require("negotiator"),
    Templar = require("templar"),
    querystring = require("querystring"),
    extend = require("xtend"),
    config = {
        errorPage: {},
        templar: {}
    }

var routil = module.exports = {
    config: function (name, data)  {
        config[name] = data
    },
    errorPage: function (req, res, details) {
        if (Array.isArray(details)) {
            var page = ErrorPage(req, res, config.errorPage)
            page.apply(page, details)
        } else {
            ErrorPage(req, res, config.errorPageConfig)(details)
        }
    },
    redirect: function (req, res, target, statusCode) {
        res.statusCode = statusCode || 302
        res.setHeader('location', target)

        routil.mediaTypes(req, res, {
            "application/json": function () {
                routil.json(res, {
                    redirect: target,
                    statusCode: statusCode
                })
            },
            "default": function  () {
                var html =  '<html><body><h1>Moved'
                if (statusCode === 302) {
                    html += ' Permanently'
                }
                html += '</h1><a href="' + target + '">' + target + '</a>'

                routil.html(res, html)
            }
        })()
    },
    mediaTypes: function (req, res, object)  {
        var types = Object.keys(object),
            mediaType = new Negotiator(req).preferredMediaType(types)

        return object[mediaType] || object.default || notSupportedHandler

        function notSupportedHandler() {
            routil.errorPage(req, res, 
                [new Error("mediaType not supported"), 415])
        }
    },
    json: function (res, object, statusCode) {
        routil.send(res, JSON.stringify(object), statusCode, {
            "Content-Type": "application/json"
        })
    },
    html: function (res, data, statusCode) {
        routil.send(res, data, statusCode, {
            "Content-Type": "text/html"
        })
    },
    send: function (res, data, statusCode, headers) {
        if (!Buffer.isBuffer(data)) {
            data = new Buffer(data)
        }
        
        res.writeHead(statusCode || res.statusCode || 200, 
            extend((headers || {}), {
                "Content-Length": data.length
            }))

        res.end(data)
    },
    methods: function (routes) {
        return requestHandler

        function requestHandler(req, res, params) {
            var method = req.method

            if (routes[method]) {
                return routes[method](req, res, params)
            }
            routil.errorPage(req, res, 405)
        }
    },
    template: function (req, res, name, data) {
        Templar(req, res, config.templar)(name, data)
    },
    Templar: Templar,
    body: function (req, callback) {
        if (req.body) {
            callback(req.body)
        }

        var requestBody = "",
            stringDecoder = new StringDecoder

        req.on("data", addToBody)

        req.on("end", returnBody)

        function addTobody(buffer) {
            requestBody += stringDecoder.write(buffer)
        }

        function returnBody() {
            req.body = requestBody
            callback(requestBody)        
        }
    },
    form: function (req, res, callback)  {
        if (req.headers['Content-Type'] !==
            'application/x-www-form-urlencoded'
        ) {
            // XXX Add support for formidable uploading, as well
            routil.errorPage(req, res, 415)
        } 
        routil.body(req, parseBody)

        function parseBody(body) {
            callback(querystring.parse(body))
        }
    }
}