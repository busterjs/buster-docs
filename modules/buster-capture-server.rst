.. default-domain:: js
.. highlight:: javascript
.. _buster-capture-server:

=====================
buster-capture-server
=====================


Version:
    0.5 (2012-xx-xx)
Module:
    ``var captureServerModule = require("buster-capture-server");``

The capture server captures browsers as slaves, and offers a completely generic
API for carrying out work across those slaves. A workload is known as a
"session", and a test run is typically a session. Other uses include for
instance synced-across-devices slide shows (for which a POC has been built).

In general, the server knows nothing specifically of testing. It knows how to
accept and serve web pages (in the form of resource sets), capture and command
browser slaves, and coordinate every piece using messaging (Bayeux on the HTTP
level, or websockets if available).


The server
==========

The server is the central hub for all work in buster-capture-server. It needs
to be manually attached to an existing node HTTP server.

.. function:: captureServerModule.createServer

    ::

        var server = captureServerModule.createServer();

    Creates a server instance.


.. function:: server.attach

    ::

        server.attach(httpServer);

    Attaches the buster-capture-server to a `Node.js HTTP server
    <http://nodejs.org/docs/latest/api/http.html>`_. All HTTP requests that
    buster-capture-server handles is "consumed", and won't trigger any
    "request" event listeners on the Node.js HTTP server.


Server client
=============

To interact with a server, you always use a server client. This has the benefit
of making the API for interacting with the server identical whether the server
runs in the same process as your own code, or the server is in another process
(or even on another computer).


.. function:: captureServerModule.createServerClient

    ::

        var serverClient = captureServerModule.createServerClient(opts);

    Creates a new server client.

    **Options**

    ``host`` (required):
          The hostname where the http server is running.

    ``port`` (required):
          The port the http server listens on


.. function:: serverClient.createSession

    ::

        var promise = serverClient.createSession(opts);

    Creates and queues a new session.

    The promise resolves with the session object, and rejects with an error
    object.

    **Options**

    ``resourceSet``:
        The :ref:`resource set <resource-sets>` containing the full web page of
        the session. The resource with the path ``"/"`` is assumed to be a html
        page and is loaded into the captured browsers.

    ``cache``:
        Boolean specifying whether or not caching should be performed.
        Defaults to ``false``.

    ``joinable``:
        Boolean specifying whether the session is joinable, meaning whether
        browsers captured after the session has started will get the session
        loaded into them. Defaults to ``true``.

    ``staticResourcesPath``:
        Boolean specifying whether the same path should be used for all
        sessions. When false, each session will get a new path. The actual
        value is unspecified, but it might be something like
        ``"/sessions/123-long-id-here/resources"``. This is useful to force
        browsers to reload all the resources as the path will be different for
        each session. When true, each session will be loaded with the same
        path. This is useful for debugging, buster test uses this so that
        breakpoints can be set in browser debuggers and apply across test runs.
        Defaults to ``false``


.. function:: serverClient.connect

    ::

        serverClient.connect();

    Connects the server client to the server. Needs to be called manually,
    typically immediately after the server client is created.


.. function:: serverClient.disconnect

    ::

        serverClient.disconnect();

    Disconnecting is not mandatory, it's only provided as a convenience if you
    want to clean up the connections. You can also just kill the process
    without disconnecting first, the server will be fine.


Session client
==============

A session client is created for each session you want to interact with. It
provides lifecycle events, and user specific pubsub events to send data to and
from the slaves.

.. function:: captureServerModule.createSessionClient

    ::

        var sessionClient = captureServerModule.createSessionClient(opts);

    Creates a new session client.

    **Options**

    ``session`` (required):
        The session object to create a client for. This is the same object that
        is emitted from the server client promise when you create a new
        session.

    ``host`` (required):
        The hostname where the http server is running.

    ``port`` (required):
        The port the http server listens on.


.. function:: sessionClient.connect

    ::

        sessionClient.connect();

    Connects the session client. Needs to be called manually for every session
    client create, typically immediately after the session client is created.


.. function:: sessionClient.disconnect

    ::

        sessionClient.disconnect();

    Disconnecting is not mandatory, it's only provided as a convenience if you
    want to clean up the connections. You can also just kill the process
    without disconnecting first, the server will be fine.


.. function:: sessionClient.emit

    :;

        sessionClient.emit(event[, data]);

    Emit an event to all slaves.

    The event is a string. Examples: ``"goto"``, ``"slide:next"``,
    ``"testcase:state:timeout"``.

    The data is optional, and will be JSON serialized in the form of ``{data:
    /* &lt;your data here&gt; */}``, so it can be an array, and object, a
    string, or a number.

    ::

        sessionClient.emit("slide:goto", 5);
        sessionClient.emit("slide:next");


.. function:: sessionClient.on

    ::

        sessionClient.on(event, handler);

    Listens to events from all slaves.

    The event string is identical in format to the one in
    :func:`sessionClient.emit`.

    The handler is a function, taking one argument which is the data that was emitted.

    ::

        sessionClient.on("test:success", function (testInfo) {
            reporter.reportSuccess(testInfo);
        });
        sessionClient.on("test:failure", function (testInfo) {
            reporter.reportFailure(testInfop);
        });


.. function:: sessionClient.end

    ::

        sessionClient.end();

    Ends the session.


Lifecycle events
================

Promises are used for lifecycle events. These events only trigger once per session.

.. note:: TODO

    We also need events for slave join and leave.

``sessionClient.started``:
    The session is now at the top of the session queue and is about to get
    loaded into the captured browsers.

``sessionClient.loaded``:
    The session is now fully loaded into all the slaves.

``sessionClient.ended``:
    The session is about to end.

``sessionClient.unloaded``:
    The session is now fully unloaded from all slaves and the next session in
    the queue (if any) will now be loaded.

::

    var sessionClient = bCapServ.createSessionClient({
        host: "0.0.0.0",
        port: 8080,
        session: aSession
    });
    sessionClient.connect();

    // Emit an event  to slaves when all slaves have loaded the session.
    sessionClient.loaded.then(function () {
        sessionClient.emit("some:event", 123);
    });



Browser (or slave) environment
==============================

The slave environment for your sessions is a frame in a frameset. APIs are made
available so you can send messages to and from the slave and the session
client.


.. attribute:: buster.env.id

    The ID of the current slave.


.. attribute:: buster.env.contextPath

    The context path to where the session resource set resources are available.
    If you have a resource with the path ``"/foo/bar.js"``, you can dynamically
    create a script tag for it like so::

        var scriptTag = document.createElement("script");
        scriptTag.src(buster.env.contextPath + "/foo/bar.js");
        document.body.appendChild(scriptTag);

    Note that a relative path would also work::

        var scriptTag = document.createElement("script");
        scriptTag.src("foo/bar.js");
        document.body.appendChild(scriptTag);


.. function:: buster.emit

    ::

        buster.emit(event, [data]);

    Emits the event to session client and all slaves, including itself.

    ::

        buster.emit("slide:goto", 1);
        window.addEventListener("keyup", function (e) {
            if (e.keyCode == 37) buster.emit("slide:prev");
            if (e.keyCode == 39) buster.emit("slide:next");
        });


.. function:: buster.on

    ::

        buster.on(event, handler);

    Listens to the event.

    ::

        buster.on("slide:goto", function (num) {
            currentSlide = num;
            loadCurrentSlide();
        });
        buster.on("slide:next", function () {
            ++currentSlide;
            loadCurrentSlide();
        });
