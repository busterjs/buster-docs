.. default-domain:: js
.. highlight:: javascript

=========================================
Shimming test runners on top of Buster.JS
=========================================

This how-to explains how to automate test runs over Buster.JS' capture server
using other test frameworks than Buster.JS. This is the easiest and least
flexible way of achieving said goal. For more options (and more work), see
`creating your own xx-server and xx-test </howto/reusing-cli-tools>`_.

Meet srsly
==========

To illustrate how to shim a test runner onto Buster.JS' runner, we'll need some
code to test and a test framework that's not Buster.JS. The code to test will be
an implementation of the CIA-grade encryption algorithm ``rot13``:

::

    function rot13(str) {
        return str.split("").reduce(function (s, c, i) {
            if (!/[a-z]/i.test(c)) { return s + c; }
            var pos = str.charCodeAt(i);
            var normalize = /[a-z]/.test(c) ? 97 : 65;
            return s + String.fromCharCode(((pos - normalize + 13) % 26) + normalize);
        }, "");
    }

We will test this code using the brand new testing framework ``srsly``:

::

    srsly("rot13 encodes text", rot13("hello"), "uryyb");
    srsly("does not rot13 encode numbers", rot13("1234"), "1234");
    srsly("rot13 encodes captial letters", rot13("ABCDE"), "NOPQR");
    srsly.checkit();

The implementation of ``srsly`` is irrelevant. All we need to know is its
features. To keep things simple, all of its features are available in the above
example:

- The ``srsly`` function creates a test. A test is a name and two values that
  should be equal.
- When there are no more facts to describe, we call ``srsly.checkit`` to verify
  all the facts stated so far.

That's it. To piggy-back the Buster.JS toolchain, we are going to create an
adapter that will take the above ``srsly`` fact sheet and convert it to a
Buster.JS test case (and later a "proper" adapter that outputs Buster.JS'
internal data format).

Anatomy of a Buster.JS test case
--------------------------------

The above ``srsly`` fact sheet can be expressed as a Buster.JS test case in the
following way:

::

    buster.testCase("srsly", {
        "rot13 encodes text": function () {
            assert.equals(rot13("hello"), "uryyb");
        },

        "does not rot13 encode numbers": function () {
            assert.equals(rot13("1234"), "1234");
        },

        "rot13 encodes captial letters": function () {
            assert.equals(rot13("ABCDE"), "NOPQR");
        }
    });

The ``srsly`` adapter
---------------------

The first incarnation of the adapter is pretty straight forward:

::

    function srsly(name, actual, expected) {
        if (!srsly.testCase) {
            srsly.testCase = {};
        }

        srsly.testCase[name] = function () {
            assert.equals(actual, expected);
        };
    }

    srsly.checkit = function () {
        if (!srsly.testCase) { return; }
        buster.testCase("srsly", srsly.testCase);
    };

If implementing the adapter as a proxy to ``buster.testCase`` feels a bit hacky
to you, you might want to read 'Shimming "properly"' towards the end of this
howto.

Trying the adapter
------------------

Create a new directory called ``srsly-buster`` to house our experiment. Inside
it, create the ``lib``, ``src`` and ``test`` directories. Put the ``rot13``
function in a file called ``src/rot13.js``. The ``srsly`` test goes in
``test/rot13-test.js``. Finally, put the ``srsly`` adapter in
``lib/buster-srsly.js``. Then create the ``buster.js`` configuration file in the
root directory with the following contents:

::

    exports.Browser = {
        libs: ["lib/*.js"],
        sources: ["src/*.js"],
        tests: ["test/*.js"]
    };

Now, install Buster.JS if you haven't already:

::

    $ npm install -g buster

Then, start the server:

::

    $ buster-server

Visit `http://localhost:1111 <http://localhost:1111>`_ and hit the "capture"
button (or visit `http://localhost:1111/capture
<http://localhost:1111/capture>`_ directly). Finally, run the "fact sheet":

::

    $ buster test

Your tests should have executed flawlessly. Requiring your users to manually
download and include your adapter this way isn't exactly optimal. A better
approach is to wrap it up as an NPM installable Buster.JS extension.

Packaging the adapter as an extension
=====================================

An extension is a node module that exposes an object that implements one or more
specific methods that Buster.JS will call with specific data. We want to add a
file (the adapter) somewhere so it loads before the tests. To do this, we will
implement the ``configure`` method, and use the ``"load:framework"`` hook.

The extension is a project in its own right. Inside the project directory,
create the ``node_modules`` directory, then put another directory inside it
called ``buster-srsly`` (``buster-*`` is a common naming convention for
Buster.JS extensions). Copy the adapter from before to this directory, so its
full path becomes ``./node_modules/buster-srsly/adapter.js`` (i.e. ``cp
lib/buster-srsly.js node_modules/buster-srsly/adapter.js``).

Inside this directory, we will create a new file called
``index.js`` (the full path, relative to the project, should be
``./node_modlues/buster-srsly/index.js``). This file contains the extension:

::

    var path = require("path");

    module.exports = {
        configure: function (config) {
            config.on("load:framework", function (resourceSet) {
                resourceSet.addResource({
                    path: "/buster/srsly-adapter.js",
                    file: path.join(__dirname, "adapter.js")
                }).then(function (resource) {
                    resourceSet.loadPath.append(resource.path);
                });
            });
        }
    };

If you want to name this file something other than ``index.js`` you also have to
add a ``package.json`` file to the project. How to create Node modules is beyond
the scope of this howto.

Update the ``buster.js`` configuration file to use the extension rather than the
custom lib file:

::

    exports.Browser = {
        extensions: [require("buster-srsly")],
        sources: ["src/*.js"],
        tests: ["test/*.js"]
    };

Running the tests should now produce the same results as before.

What's a "resource set"?
------------------------

The extension exposes the local file ``./adapter.js`` on the Buster.JS server as
``/buster/srsly-adapter.js``, and it makes sure that when tests run, it is
included using a ``script`` tag.

A resource set is a collection of files and other resources to expose on the
server. A resource can be a file, some inlined contents or an HTTP proxy. At the
very least, a resource has a path (e.g. the path used to reach the resource on
the server) and some contents (it can also have specific headers and more). In
our example the contents is ``file``, which means Buster.JS will read the
contents of the given file when necessary. Resources are cached on the server,
and are only resent to the server (thus, read from disk) when they have been
modified since the last run.

After the file has been added as a resource, it is added to the load path. The
load path is a list of paths available in the resource set that will be loaded
by the web page that executes tests. That means ``script`` tags for JavaScript
and ``link`` tags for CSS.

The ``load:framework`` event
----------------------------

The resource set we are working with for this example is the one provided by
the framework hook. In all, there are four of these hooks that allow you to add
sources:

- ``"load:framework"``
- ``"load:libs"``
- ``"load:sources"``
- ``"load:tests"``

Which one to listen for depends on what you want to do. In our case, we want to
add a new API that may be used in lib files, sources and tests. The framework
event is well suited for this, although ``"load:libs"`` would have worked as
well, as extensions are loaded before the user's files.

Changing the look and feel
==========================

You may feel that much of the personality of your test framework is gone, as
everything visible to the user is coming from Buster.JS. Changing these things
is beyond the scope of this howto, but you may be interested in creating a
custom reporter or even replacing the binary with your own (subject of the next
howto, `Creating your own xx-server and xx-test </howto/reusing-cli-tools>`_).

Shimming "properly"
===================

Buster.JS ships with two ways to write tests: the xUnit style test cases, and
the "BDD" style specifications. The Buster.JS test runner really knows nothing
of neither. Instead, the runner knows how to run "test contexts", which is the
common data format exported by both default frontends. A test context is an
object with an array of test functions, and optionally an array of nested
contexts. Each context may in turn have before/after hooks and more.

Implementing our adapter in terms of this data format is less hacky, and just
as easy:

::

    function srsly(name, actual, expected) {
        if (!srsly.context) {
            srsly.context = { tests: [] };
            buster.testContext.emit("create", srsly.context);
        }

        srsly.context.tests.push({
            name: name,
            func: function () {
                assert.equals(actual, expected);
            }
        });
    }

    srsly.checkit = function () {};

With this approach, the ``checkit`` function is a noop. The ``srsly`` function
emits the ``"create"`` event to signal that a new test context is available. The
test context object is modified to include a new test every time ``srsly`` is
called.

Asynchronous contexts
---------------------

Let's assume that ``srsly`` supports asynchronous calls to ``srsly``. Our
current implementation leaves it to chance whether or not those will be run. To
take control of the situation, we can emit an async context the first time
``srsly`` is called, and resolve it when ``checkit`` is called.

To solve this problem, we will borrow Buster.JS' ``when`` dependency. Note that
the way Buster.JS currently exposes ``when`` as a global is considered a bug, so
future implementations will have to either ship their own promise implementation
or use ``buster.when``, which is where it'll be found when this issue is
resolved.

::

    function srsly(name, actual, expected) {
        if (!srsly.context) {
            srsly.context = { tests: [] };
            srsly.deferred = when.defer();
            buster.testContext.emit("create", srsly.deferred.promise);
        }

        srsly.context.tests.push({
            name: name,
            func: function () {
                assert.equals(actual, expected);
            }
        });
    }

    srsly.checkit = function () {
        if (!srsly.deferred) { return; }
        srsly.deferred.resolve(srsly.context);
    };

This final version of our adapter properly supports asynchronous tests.
