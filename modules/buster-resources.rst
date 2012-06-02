.. default-domain:: js
.. highlight:: javascript
.. _buster-resources:

================
buster-resources
================

Version:
    0.2 (2012-01-15)

Module:
    ``var resources = require("buster-resources");``

Manages virtual file systems that can be easily transported over network.
Buster.JS uses resource collections to ship your source files and tests to
:ref:`buster-capture-server`, but they can also be used for other purposes,
like mixing files on disk and "virtual" files for build scripts and whatnot.

The central data types is the resource--which can be a file on disk, an
in-memory "file" or an http proxy--and the resource set. A resource set is a
collection of resources that allows the creation of e.g. combined resources,
and can be serialized as a whole and transported over the network. Resource
sets can be cached and served over http using objects in this module.


Resource middleware
===================

::

    var resourceMiddleware = require("buster-resources").resourceMiddleware;

The resource middleware can serve resource sets over HTTP. In its simplest
form, you spin up an instance, designate a context path to it, mount a resource
set (only one can be served at any given time), and allow it to handle requests
entirely on its own::

    var http = require("http");
    var rs = require("buster-resources");

    var middleware = rs.resourceMiddleware.create("/resources");

    var set = rs.resourceSet.create();
    set.addResource({ path: "/buster.js", content: "Booyah!" });
    middleware.mount(set);

    http.createServer(function (req, res) {
        if (middleware.respond(req, res)) { return; }
        res.writeHead(404);
        res.end();
    }).listen(9988);

    // Test it
    http.request({
        host: "localhost",
        port: 9988,
        path: "/resources/buster.js"
    }, function (res) {
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            console.log(chunk);
        });
    }).end();

.. function:: resourceMiddleware.create(contextPath)

    ::

        var middleware = resourceMiddleware.create(contextPath);

    Create a new instance to serve resource sets. The middleware will only
    respond to requests within the context path. The context path is also
    stripped from the URL before finding resources.

.. function:: resourceMiddleware.setContextPath(contextPath)

    Change the context path.

.. function:: resourceMiddleware.mount(resourceSet)

    Serve contents of resource set. If another resource set is mounted, it will
    be dismounted.

.. function:: resourceMiddleware.respons(req, res)

    ::

        var willRespond = middleware.respond(req, res);

    Responds to an HTTP request, if the request is for a path within the
    middleware's context path. If the middleware intends to handle the request,
    this method returns ``true`` (even if the request may not have been handled
    synchronously). Otherwise, it returns ``false``.

    If the request is within the middleware's context path, but does not match
    any resources, the middleware will give a 404 response.

    Typical usage::

        var http = require("http");
        var resourceMiddleware = require("buster-resources").resourceMiddleware;
        var middleware = resourceMiddleware.create("/resources");

        // Mount sets

        http.createServer(function (req, res) {
            if (middleware.respond(req, res)) { return; }

            // Handle requests not handled by the middleware
        }).listen(8000);


Resource cache
==============

::

    var resourceSetCache = require("buster-resources").resourceSetCache;

Cache content across resource sets. The resource set cache works as a central
repository that you pass resource sets by to have their contents cached, and
their missing contents replenished from the cache.


.. function:: resourceSetCache.create(ttl)

    ::

        var cache = resourceSetCache.create(ttl);

    Creates a new cache. ``ttl`` decides for how many milliseconds individual
    resources are cached. The default time to live for resources is one hour.
    Note that the ``ttl`` only determines how long resources stay in the
    internal cache. Once you've inflated (using :func:`cache.inflate`) a
    resource set with a cached resource, it will stick around in that resource
    set until you remove it on your own.

.. function:: cache.inflate(resourceSet)

    ::

        var promise = cache.inflate(resourceSet);

    Inflating a resource set achieves two things:

    1. Any resource in the set that has an ``etag`` and content will be cached.

    2. Any resource in the set that has an ``etag`` and whose content is empty,
       will be replaced with a cached copy, if one exists.

    Note that the resource cache caches entire resources, not only content. To
    avoid having certain resources cached, simply make sure they don't have an
    ``etag`` set.

    Serving resource sets with a cache::

        var http = require("http");
        var rs = require("buster-resources");

        var middleware = rs.resourceMiddleware.create("/resources");
        var cache = rs.resourceSetCache.create(60 * 60 * 1000);

        // Assume 'set' is a resourceSet instance
        cache.inflate(set).then(function (inflatedSet) {
            middleware.mount(inflatedSet);
        });

.. function:: cache.resourceVersions(resourceSet)

    ::

        var result = cache.resourceVersions(resourceSet);

    Returns an object with information about all path/etag combinations
    contained in the cache::

        set.addResource({ path: "/buster.js", etag: "123", content: "OK" });
        set2.addResource({ path: "/buster.js", etag: "abc", content: "Newer" });

        when.all([cache.inflate(set1), cache.inflate(set2)], function () {
            cache.resourceVersions() === {
                "/buster.js": ["abc", "123"]
            };
        });


Resource sets
=============

::

    var resourceSet = require("buster-resources").resourceSet

A resource set lets you represent a set of files associated with paths. It lets
you create bundles of multiple resources, proxy certain paths to other HTTP
servers, preprocess resources (for example convert CoffeeScript into
JavaScript), and more.

.. function:: resourceSet.deserialize(data)

    ::

        var promise = resourceSet.deserialize(data);

    Deserialize a resource set. The ``data`` should be a JavaScript object, the
    kind that :func:`resourceSet.serialize` produces. The method returns a
    promise that resolves with the fully inflated resource set.

    Typically, when receiving resource sets over HTTP, they will be JSON
    encoded, bring it back to life like so::

        var resourceSet = require("buster-resource").resourceSet;

        // Assume 'data' holds a JSON encoded resource set serialization
        resourceSet.deserialize(JSON.parse(data)).then(function (set) {
            // Serve set over HTTP or similar
        });

.. function:: resourceSet.create(rootPath)

    ::

        var set = resourceSet.create(rootPath);

    Creates a new resource set. The ``rootPath`` is used to resolve globs and
    direct file paths. If not provided, it defaults to the current working
    directory. You can not add files to a resource set if they live outside the
    resource set root directory.

.. attribute:: resourceSet.length

    The length of the resource set is the number of resources in it. Resource
    sets expose resources through an array-like interface with ``length`` and
    numeric properties.

.. function:: resourceSet.addResources(resources)

    ::

        var promise = resourceSet.addResources(resources);

    Adds multiple resources. Argument is an array of resources as accepted by
    :func:`resourceSet.addResource`.  The method returns a promise that
    resolves with an array of resources.

.. function:: resourceSet.addResource(resource)

    ::

        var promise = resourceSet.addResource(resource);

    Adds a resource. The argument can be either a proper :func:`resource`
    instance, a string (either a file path or a glob, see
    :func:`resourceSet.addGlobResource`) or an object with properties
    describing a resource. The method returns a promise that resolves with a
    single resource.

.. function:: resourceSet.addGlobResource(path)

    ::

        var promise = resourceSet.addGlobResource(path);

    Add all files matching the glob as resources. Returns a promise that
    resolves with an array of resources. The glob is resolved relatively to the
    resource set ``rootPath``.

.. function:: resourceSet.addFileResources(paths, options)

    ::

        var promise = resourceSet.addFileResources(paths, options);

    Add multiple files as resources with common meta data ``options``. Each
    path will be passed along with ``options`` to
    :func:`resourceSet.addFileResource`. Returns a promise that resolves with
    an array of resources.

.. function:: resourceSet.addFileResource(path, options)

    ::

        var promise = resourceSet.addFileResource(path, options);

    Adds a file as resource. The path is resolved against the resource set
    ``rootPath``. You can provide the path to serve the resource through as
    part of the ``options`` object. Returns a promise that resolves with a
    single resource.

.. function:: resourceSet.addCombinedResource(sources, options)

    ::

        var promise = resourceSet.addCombinedResource(sources, options);

    Add a resource whos content is the combination of other resources in the
    set. ``sources`` is an array of paths to other pre-existing resources.
    Returns a promise that resolves with a single resource.

.. function:: resourceSet.get(path)

    ::

        var resource = resourceSet.get(path);

    Returns the resource at ``path``. The path will be normalized before
    lookup::

        resourceSet.get("buster.js") === resourceSet.get("/buster.js");

.. function:: resourceSet.remove(path)

    Removes a resource with the  given path. Will also remove it from
    ``loadPath`` if present.

.. function:: resourceSet.serialize()

    ::

        var promise = resourceSet.serialize();

    Serializes the resource set. The serialization format is a plain JavaScript
    object with two properties: :attr:`resources
    <resourceSetPayload.resources>` and :attr:`load <resourceSetPayload.load>`,
    both of which are arrays. The serialized object can safely be JSON encoded
    for wire transfer.  The serialization will also have all resource contents
    loaded in a flat structure.

.. function:: resourceSet.concat(rs2, rs3, ...)

    ::

        var newRs = rs1.concat(rs2, rs3, ...);

    Create a new resource set by combining this one with one or more other
    resource sets. Does not mutate any of the existing resource sets.

.. function:: resourceSet.appendLoad(paths)

    Append paths to the load path. Paths may be glob patterns. Any path does
    not match an existing resource in the resource set will be added from disk
    before added to the load path. This is different from calling ``append``
    directly on the ``loadPath``, where a missing resource causes an error.

.. function:: resourceSet.prependLoad(paths)

    Like :func:`resourceSet.appendLoad`, only prepend to the load path in place
    of append.

.. attribute:: resourceSet.loadPath

    An object that allows you to control what resources should be loaded when
    the resource set is loaded.


Resource set load path
======================

The following methods are available on the :attr:`resourceSet.loadPath` object.

.. function:: loadPath.append(paths)

    Append paths to the end of the load path.

.. function:: loadPath.prepend(paths)

    Prepend paths to the beginning of the load path.

.. function:: loadPath.remove(path)

    Remove path from load path.

.. function:: loadPath.clear()

    Remove all paths from load path.

.. function:: loadPath.paths()

    ::

        var paths = loadPath.paths();

    Returns an array of paths on the load path. This array is just a copy, and
    can not be used to mutate the load path.


Resource set payload
====================

.. warning::
    Old and outdated

The resource set payload is an object that consists of a set of resources, and
optionally a list of resources to automatically load in the root resource.

**TODO: Write about root resource and auto injection.**

::

    resources.createResourceSet({
        resources: {
            "/path": {...},
            "/other-path": {...},
                ...
        },
        load: [resourcePath, ...]
    });

.. attribute:: resourceSetPayload.resources

    An object where the key is the path and the value is
    the :ref:`resource payload <resource-payload>`. The equivalent of calling
    :func:`resourceSet.addResource()`.

.. attribute:: resourceSetPayload.load

    List of paths to "load". The path must exist as a resource.

    In :ref:`buster-capture-server`, the resources in ``load`` will be
    automatically injected as script tags before the closing ``</body>`` tag. A
    resource set does not in itself know what it means to load something.


.. _resource-payload:

Resource payload
================

This section describes the object that is passed to resource creation, such as
``resourceSet.addResource("/path", payload)`` and
``resourceSet.addFile("/path/to/file", payload)``.


String as content
-----------------

::

    {content: "a string"}

Sets the content of the resource to the value of the string.</p>


Buffer as content
-----------------

::

    {content: new Buffer(...)}

Sets the content of the resource to the value of the buffer.</p>


Function as content
-------------------

::

    {content: function (promise) {}}

Function will be called when needed and allows for asynchronous fetching of
content via a promise. This is what :func:`resourceSet.addFile` uses under the
hood.

It is imperative that you either resolve or reject the promise. There's no
internal time out, so if you do networking or something else that could time
out, you should create your own timeout and reject the promise when the timeout
fires. You also need to make sure you don't accept the promise after you
already rejected it, and vice versa.

::

    resourceSet.addResource("/foo", {
        content: function (promise) {
            // We don't do anything asynchronous here so we might as well
            // have used a string directly instead of a function.
            promise.resolve("This is the content");
        }
    });

::

    resourceSet.addResource("/foo", {
        content: function (promise) {
            fs.readFile("/foo", function (err, data) {
                if (err) {
                    promise.reject(err);
                } else {
                    promise.resolve(data);
                }
            });
        }
    });

::

    resourceSet.addResource("/foo", {
        content: function (promise) {
            http.request(
                {host: "myserver.com", port: 80, path: "/test"},
                function (res) {
                    var data = "";
                    res.on("data", function (chunk) { data += chunk; });
                    res.on("end", function () { promise.resolve(data); });
                }
            ).end();
        }
    });


Headers
-------

::

    {headers:{"Header": "Value"}}

Set custom headers. A Content-Type header will be added automatically if not
present, via the `node-mime <https://github.com/bentomas/node-mime>`_ project.


Etag
----

::

    {etag:"value"}

The etag is used in combination with the name of the resource to determine
wether the :ref:`buster-capture-server` already has this resource.

How the etag is calculated is entirely up to you. By convention, the only
expectation is that if the file for which the resource points to has changed,
the etag should change as well. Internally in buster, we calculate the etag by
applying SHA1 to the mtime and the absolute path to the file.

**TODO: write more about how to practically perform caching against
buster-capture-server.**


Backend
-------

::

    {backend: "url"}

A full URL to a http server that will be requested when the resource in
question is requested.

The URLs will be rewritten based on the path to the resource
itself. For::

    resourceSet.addResource("/foo", {backend: "http://example.com"});

a call to::

    resourceSet.getResource("/foo/test", cb);

will perform a request to *http://example.com/test**.


Combine
-------

::

    {combine: ["/foo.js", "/bar.js"]}

Combines existing reseources into one resource. The resources passed have
to exist before you create a combined resource for them.
