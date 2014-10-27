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

Load in your configuration file, specifying your loader and the required configuration file as libs.
You also need to add the ``buster-amd`` extension to your configuration::

    var config = module.exports;

    config["Browser tests"] = {
        environment: "browser",
        rootPath: "../",
        libs: [
            "libs/require.js",
            "requirejs-config.js"
        ],
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-amd")]
    };

.. note::

    You should list your tests and sources as normal. Your sources must be
    specified in the configuration even if you will ``require`` them from
    your tests, otherwise, Buster will not make them available on the test server.

If you have any issues with paths for your required files, check the configuration section below.

Your tests will drive the show. To run tests with the AMD extension, your
tests should be wrapped in a call to ``define``, which pulls in
dependencies (i.e. your modules) and in the callback define specs/test cases
as usual::

    define(['moduleToTest.js'], function(moduleToTest){
        buster.testCase("A test case", {
            "test the module": function(){
                assert.isObject(moduleToTest);
            }
        });
    });


Configuration
=============

The AMD extension has one configuration option: a path mapper. The path mapper
is an optional function that translates Buster.JS paths (which are absolute,
e.g. ``/test/my-test.js``) to AMD friendly module IDs.

The default mapper converts ``/test/my-test.js`` to ``test/my-test``, i.e. strips leading
slash and file suffix::

    function (path) {
        return path.replace(/\.js$/, "").replace(/^\//, "");
    }

However, if your AMD loader specifies a ``basePath`` in its configuration the default mapper might cause you issues::

    require.config({
      baseUrl: 'src/'
    });

In this case, every module your loader attempts to load will be prefixed with this basePath::

    src/test/my-test.js

You don't need to restructure your project to solve this issue.
If your tests live outside of that directory, you can fix that with a different mapping function::

    config["Browser tests"] = {
        environment: "browser",
        rootPath: "../",
        libs: [
            "libs/require.js",
            "requirejs-config.js"
        ],
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-amd")],
        "buster-amd": {
            pathMapper: function (path) {
              // prefix any path starting with a slash with ../
              return path.replace(/\.js$/, "").replace(/^\//, "../");
            }
        }
    };

In this case, your AMD loader will load the files with the following path in the browser with
the path ``src/../test/my-test.js`` which is equivalent to ``test/my-test.js``

.. note::

    If you specify your own mapper and decide not to remove the file extension
    make sure you understand how your loader deals with files with an extension.

    require.js for instance will load them with an absolute path, not prefixing these
    with a ``baseUrl`` option, but curl.js will treat these files as any other modules.

Another example: use the following mapper for AMD loader plugins::

    var config = module.exports;

    config["Browser tests"] = {
        environment: "browser",
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

Examples
========

Check the `demos repository <https://github.com/busterjs/demos>`_ for example projects.

Source code
===========

`buster-amd on GitHub <https://github.com/busterjs/buster-amd>`_
