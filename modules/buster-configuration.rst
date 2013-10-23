.. default-domain:: js
.. highlight:: javascript
.. _buster-configuration:

====================
buster-configuration
====================

Module:
    ``require("buster-configuration");``
In the browser:
    N/A (Node only)

The Buster configuration file (typically named ``buster.js``) helps Buster to
understand how to automate your test runs. You can run tests on Node without
the configuration file (i.e. with ``node my-test.js``), but it is required when
using ``buster-test`` to run tests.

A configuration file can contain one or more test run configurations, called
"groups". A group specifies which tests to run, in which environment (Node or
browser) to run them, and can provide certain
configuration options to the test runner.

The configuration file is focused on how to automate test runs. It is designed
specifically for project-specific settings only. User-specific settings, like
whether or not to use colors, what reporter to use and so on, is not part of
this configuration.


A simple configuration file
===========================

At its very simplest, a configuration file merely specifies the environment and
which resources to load. For browser tests, this includes libraries and sources,
while for Node you only need to specify tests (as typically they ``require``
their own sources).

::

    var config = module.exports;

    config["Browser tests"] = {
        environment: "browser",
        libs: ["lib/**/*.js"],
        sources: ["src/core.js", "src/**/*.js"],
        tests: ["test/**/*.js", "!test/**/*integration-test.js"]
    };

The configuration file is a JavaScript file. In fact, it is a Node module, as
you might have guessed from the first line. The first line is pure vanity by
the way. We think "config" reads better throughout the file than "exports".

This configuration specifies a browser run (as seen from the ``environment``
property). It will cause all files in ``lib`` to be loaded first (using
``script`` tags), then all files in ``src``, then all files in ``tests``. Note
how we specified ``src/core.js`` separately. Buster resolves these
duplications, and you typically want to specify some files manually if ordering
is important.
To exclude files you just need to prepend a ``!`` as you can see
in the second pattern of the ``tests`` property. In the example that pattern
prevents the integration tests to be run.


Configuration properties
========================

To avoid wasting your time on typos and misunderstandings, Buster will
fiercefully throw errors if you feed it configuration properties it does not
recognize. The following is a list of all the properties Buster recognizes.

``tests``:
    The test files to load and run. Value is an array of file names and/or glob
    patterns. Files are loaded in the order provided. Like the ``libs`` and
    ``sources`` properties, it may include duplicates. However, it is highly
    recommended that your tests are not order dependent. Test helpers and
    similar utilities should be loaded with the ``testHelpers`` property (or
    just ``require`` them on Node).

``specs``:
    Alias for ``tests``

``environment``:
    ``browser`` or ``node``. The browser environment allows you to run tests
    from the command-line and have them executed in one or more browsers
    through the server component of Buster.JS. Refer to the :ref:`browser
    testing page <browser-testing>`.

``env``:
    Alias for ``environment``.

``rootPath``:
    By default, Buster will resolve file paths in the configuration file
    relative to the directory in which the configuration file is found. Setting
    a ``rootPath`` allows you to change the base of path lookups. Note that
    ``rootPath`` itself is also resolved relative to the directory where the
    configuration file is found.

The following properties only apply to the browser environment.

``testHelpers``:
    Library files to load in ``script`` tags in the browser. This setting
    should normally not be used for Node runs. If it is, files will be
    ``require``'d. Value is an array of file names and/or glob patterns. Files
    are loaded in the order provided. It may include duplicates, e.g.
    ``["test/lib/core.js", "test/lib/**/*.js"]``, files will only be loaded
    once. ``testHelpers`` are loaded after libraries and sources, but before
    tests.

``specHelpers``:
    Alias for ``testHelpers``

``libs``:
    Library files to load in ``script`` tags in the browser. This setting
    should normally not be used for Node runs. If it is, files will be
    ``require``'d. Value is an array of file names and/or glob patterns. Files
    are loaded in the order provided. It may include duplicates, e.g.
    ``["lib/core.js", "lib/**/*.js"]``, files will only be loaded once.
    Libraries are loaded before anything else.

``deps``:
    Alias for ``libs``

``sources``:
    Source files to load in ``script`` tags in the browser. This setting should
    normally not be used for Node runs. If it is, files will be ``require``'d.
    Value is an array of file names and/or glob patterns. Files are loaded in
    the order provided. It may include duplicates, e.g. ``["src/core.js",
    "src/**/*.js"]``, files will only be loaded once. Sources are loaded after
    libraries and before test libraries and tests.

``src``:
    Alias for ``sources``

``resources``:
    Additional resources that will be made available for test runs, but not
    explicitly loaded. Value is an array of resources. Resources are served
    from a context path on the server. To request a resource in your test
    runs, you need to scope resource paths with ``buster.env.contextPath``.
    The resource ``/some/cookies.json`` can be requested as
    ``jQuery.get(buster.env.contextPath + "/some/cookies.json");``

    A resource can be a string, i.e. a glob pattern/file name, or an object.
    Objects may specify resources that are inlined content to be served
    as a file, a combination of other resources (optionally minified) or a
    proxy to another web server. See `resource <#resource>`_.

``autoRun``:
    Only applies to browser runs. When set to ``false``, Buster will not run
    tests immediately after loading all files. Refer to
    :ref:`starting-testrun-manually` for more information.

``extends``:
    Takes a group name, and loads all the configuration from that group as the
    basis for this group. Content in ``libs``, ``sources``, ``tests`` and
    ``resources`` will be appended to the content from the original group.
    Other options will default to the value from the referenced group unless
    the group itself specifies a value.

    ::

        var config = module.exports;

        config["Shared tests"] = {
            tests: ["test/shared/**/*.js"]
        };

        config["Browser defaults"] = {
            extends: "Shared tests",
            environment: "browser",
            libs: ["lib/**.js"],
            extensions: ["buster-amd"]
        };

        config["Node tests"] = {
            extends: "Shared tests",
            tests: ["test/server/**.js"]
        };

        config["Browser unit tests"] = {
            extends: "Browser defaults",
            tests: ["test/browser/unit/**.js"]
        };

        config["Browser integration tests"] = {
            extends: "Browser defaults",
            tests: ["test/browser/integration/**.js"]
        };

    As you can see, the ``extends`` property makes it possible to greatly
    reduce the duplication in configuration files if you use multiple groups.
    It also encourages the use of multiple groups for multiple test profiles.

``extensions``:

    Extensions to load at runtime. The value is an array of extension objects
    which will be pinged when the configuration is loaded. If you are
    interested in developing extensions, check out the
    :ref:`extensions page <extensions>` (which also lists known extensions).

    To configure an extension, add settings under the name of the extension::

        config["Browser integration tests"] = {
            extensions: [require("buster-jstestdriver"), require("buster-coverage")],
            "buster-coverage": {
                "outputDirectory": "coverage"
            }
        };


The Configuration API
=====================

The following is only relevant if you plan on working with the Buster.JS
configuration file programatically.


Configuration
-------------

The ``configuration`` object allows you to work with a collection of groups,
possibly read from a file.

``/tmp/buster.js``::

    var config = exports;

    exports["Browser tests"] = {
        environment: "browser",
        sources: ["client/src/*.js"],
        tests: ["client/test/*.js"]
    };

    exports["Server tests"] = {
        environment: "node",
        tests: ["server/test/*.js"]
    };

Example::

    var configuration = require("buster-configuration");

    var config = configuration.create();
    config.loadFile("/tmp/buster.js");
    config.filterEnv("browser");
    config.filterGroup(/browser/);

    config.resolveGroups(function (err, groups) {
        // groups[0].resourceSet.load ==
        // ["/client/src/todo-list.js", "/client/test/todo-list-test.js"]
    });


.. attribute:: config.groups

    An array consisting of all the :ref:`config-group`.


.. function:: config.resolveGroups

    ::

        config.resolveGroups(function (err, groups) {});

    Resolves all of the groups. See :func:`configGroup.resolve`.

.. function:: config.addGroup

    ::

        config.addGroup(name, groupData);

    Adds a new group.


.. function:: config.filterEnv

    ::

        config.filterEnv(envName);

    Permanently removes all groups that aren't of ``envName``'s environment.
    The available environments are ``"browser"`` and ``"node"``.


.. function:: config.filterGroup

    ::

        config.filterGroup(regex);

    Permanently filters out groups which name doesn't match the regex. If the
    name provided is a string, it will be converted to a regular expression
    through the ``RegExp`` constructor.


.. _config-group:

Configuration group
-------------------

The individual object in the configuration's list of groups.


.. attribute:: configGroup.resourceSet

    A :ref:`buster-resources` resource set, containing resources for all the
    objects in the config group.

    This property is undefined until :func:`configGroup.resolve` is called.


.. function:: configGroup.resolve

    ::

        var promise = configGroup.resolve();

    Creates the resource set by performing all globs and file system operations
    neccesary to build up the full resource set for the config group. The group
    is pretty much useless until this method is called. It won't even have a
    ``resourceSet`` property defined.

    The promise is resolved with the ``resourceSet`` object when the group has
    been fully loaded.


.. function:: configGroup.setupFrameworkResources

    ::

        configGroup.setupFrameworkResources();

      Adds all the framework resources such as :ref:`referee`,
      :ref:`buster-test` and Sinon to the resource set for the group. These
      resources are prepended so they appear before the files of the config
      group, so that everything is loaded beforehand.

      .. note::
        This method is going away in favor of generic hooks. Buster will load
        its "framework resources" as extensions using these hooks (work in
        progress).


Example::

    grp.resolve().then(function () {
        // Load custom-thing before the files in the config group.
        grp.resourceSet.addResource("/custom-thing", {...});
        grp.resourceSet.prependToLoad("/custom-thing");

        // Load framework files, will be prepended so it loads before
        // the stuff added above
        grp.setupFrameworkResources();

        // If you wish, you can load stuff before the framework resources.
        // You probably don't need to do that though.
        grp.resourceSet.addResource("/something-else", {...});
        grp.prependToLoad("/something-else");
    });


Resource
--------

A "resource" is something exposed on the server when you run browser tests
using ``buster server`` and ``buster test``. Exposing the resource
``/something.json`` allows you to request it in your tests using e.g.
``jQuery.ajax({ url: "something.json" });``.


Content/file resources
^^^^^^^^^^^^^^^^^^^^^^

``etag``:
    The ``etag`` is used by Buster to cache resources on the server. If the
    ``etag`` has not changed since the last time the resource was uploaded on
    the server, it will use the cached version. This improves the performance,
    especially if only one or two out of potentially tens or hundreds of files
    changed since the last run.

``combine``:
    Takes an array of resources to combine into one. Useful to run tests
    against a combined build of your project::

        config["Browser build tests"] = {
            environment: "browser",
            libs: ["lib/**.js"],
            resources: [
                "src/**.js",
                { path: "/mylib.min.js",
                  combine: ["src/base.js", "src/dom.js"] }
            ],
            sources: ["/mylib.min.js"],
            tests: ["test/**.js"]
        };


    The above configuration will run tests against a combined and minified
    bundle of your application. Note that the ``combine`` property
    unfortunately does **not** understand globs (yet).

    When ``combine`` is set, you can not set ``content`` or ``file``.

``headers``:
    Custom headers to serve the resource with. Content is an object where the
    property name is the header name, and the value is the header value.

``content``:
    Contents to serve as a string or a ``Buffer``. When ``content`` is set, you
    can not set ``combine`` or ``file``.

``file``:
    File to serve. When ``file`` is set, you can not set ``combine`` or
    ``content``.


Proxy resources
^^^^^^^^^^^^^^^

``backend``:
    Another HTTP server that will handle the requests for ``path``.

    ::

        config["Browser integration tests"] = {
            resources: [
                { path: "/todo-items", backend: "http://localhost:8000/todo/todo-items" }
            ]
        };

    With this configuration, a request to ``buster.env.contextPath +
    "/todo-items/2"`` would be proxyed to
    ``"http://localhost:8000/todo/todo-items/2"``
