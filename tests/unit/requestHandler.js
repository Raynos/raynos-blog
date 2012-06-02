var requestHandler = require("../../modules/requestHandler"),
    sinon = require("sinon"),
    assert = require("assert")

describe("requestHandler", function () {
    it("should listen to server created on setup", function () {
        var spy = sinon.spy(),
            server = { on: spy }

        requestHandler.server = server
        requestHandler.setup()

        assert(spy.calledOnce, "requestHandler does not listen on server")
        assert(spy.calledWith("created", sinon.match.func),
            "requestHandler listens to server module with wrong arguments")
    })

    it("should attach request handler to server", function () {
        var spy = sinon.spy(),
            server = { on: spy }

        requestHandler.attachRequestHandler(server)

        assert(spy.calledOnce, "requestHandler does not listen  on request")
        assert(spy.calledWith("request", sinon.match.func),
            "requestHandler listens to http server with wrong arguments")
    })

    it("should call route function if router matches", function () {
        var matchStub = sinon.stub(),
            fnSpy = sinon.spy(),
            req = {
                url: "foo"
            },
            res = {},
            params = {},
            splats = {}

        matchStub.returns({
            fn: fnSpy,
            params: params,
            splats: splats
        })

        requestHandler.router = { 
            match: matchStub
        }
        requestHandler.handleRequest(req, res)

        assert(matchStub.calledOnce, "router.match was not called")
        assert(matchStub.calledWith("foo"),
            "router.match not called with the correct url")

        assert(fnSpy.calledOnce, "router.fn was not called")
        assert(fnSpy.calledWith(req, res, params, splats),
            "route.fn was not called correctly")
    })

    it("should return 404 if it failed", function () {
        var matchStub = sinon.stub().returns(false),
            setHeader = sinon.spy(),
            end = sinon.spy(),
            req = {},
            res = {
                setHeader: setHeader,
                end: end
            }

        requestHandler.router = {
            match: matchStub
        }
        requestHandler.handleRequest(req, res)

        assert.equal(res.statusCode, 404, 
            "statusCode is incorrect")
        assert(setHeader.calledOnce, 
            "multiple headers were set")
        assert(setHeader.calledWith("content-type", "text/plain"),
            "wrong header content-type was set")
        assert(end.calledOnce,
            "server response was ended multiple times")
        assert(end.calledWith("404 Not Found undefined\n"),
            "server response ended with the wrong string")
    })
})