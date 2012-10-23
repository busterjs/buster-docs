.. highlight:: javascript
.. _buster-amd:

==========
buster-amd
==========

Use an AMD loader to test asynchronous modules. You must provide your own
loader. By default, a loader that provides ``require(deps, callback)``
is assumed. This will eventually be pluggable.


Install
=======

Installation is done using npm::

    npm install buster-amd


Usage
=====

Load in your configuration file::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-amd")]
    };

Note that you list your tests and sources as normal. Your sources must be
specified in the configuration even if you will ``require`` them from
your tests, otherwise, Buster will not make them available on the test server.

Your tests will drive the show. To run tests with the AMD extension, your
tests should be wrapped in a call to ``define``, which pulls in
dependencies (i.e. your modules) and in the callback defines specs/test cases
as usual.


Configure
=========

The AMD extension has one configuration option: a path mapper. The path mapper
is an optional function that translate Buster.JS paths (which are absolute,
e.g. ``/test/my-test.js``) to AMD friendly module IDs. The default
mapper converts ``/test/my-test.js`` to ``test/my-test``, i.e. strips leading
slash and file suffix. Use this option to e.g. use AMD loader plugins.

::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-amd")],
        "buster-amd": {
            pathMapper: function (path) {
                return "plugin!" + path.replace(/^\//, "").replace(/\.js$/, "");
            }
        }
    };


Source code
===========

`buster-amd on GitHub <https://github.com/busterjs/buster-amd>`_
