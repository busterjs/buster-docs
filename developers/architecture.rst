=====================
Architecture overview
=====================

Buster.JS consists of many small Git repositories/npm modules. We try to keep
things small and separated. The repositories and installable modules both
promotes reusability (e.g. you can use `Buster assertions with any test
framework <http://cjohansen.no/using-buster-assertions-with-jstestdriver>`_)
and helps us avoid tight coupling between modules. However, some people feel
that the number of repositories are a bit daunting when trying to contribute.
This document sheds some light on existing modules, what they're for, and what
role they play in the bigger part.

Note that some of our modules contain stronger abstractions than others, and
the less obvious ones may very well change until we have something that we're
comfortable with. If you have suggestions for how certain modules can improve
(renaming/merging/splitting/refactoring/whatever), feel free to :ref:`let us
know <community>`.


Types of modules
================

Buster.JS core modules

    Core modules are those that are installed when you type ``npm install
    buster``.  They constitute the core of the test framework, and contains
    everything you need to run node tests, simple browser tests, and automated
    crowd-sourced browser tests.

Buster.JS auxilliary modules

  Developer tools and docs.

Buster.JS extensions and optional modules

  These modules provide additional and *optional* features/extensions for
  Buster.JS, such as linting, JsTestDriver support, and more.


Dependency graphs
=================

Matthias Kling generated some visual `dependency graphs
<https://github.com/meisl/buster-dev-tools/tree/dependency_graph/dependencyGraphs>`_.
They're a great complement to this article, visualizing how packages depend on
each other.

.. image:: https://github.com/meisl/buster-dev-tools/raw/dependency_graph/dependencyGraphs/buster-dependencies_normal.png
    :width: 700


Core modules
============


buster
------

Status:
    Stable

Source code:
    :repo:`buster`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster.png">
        </a>

Meta-package that's the install target, thus carries quite a lot of
dependencies. Includes some very rudimentary wiring across Buster repositories.


buster-analyzer
---------------

Status:
    In development, may change significantly

Source code:
    :repo:`buster-analyzer`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-analyzer" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-analyzer.png">
        </a>

A simple and generic mechanism for flagging warnings. The analyzer is an event
emitter, and provides ``fatal``, ``error`` and ``warning`` methods, which emit
corresponding events. Additionally, the analyzer has a concept of ok/not ok.
This is decided from a threshold (i.e., a threshold of "error" means "not ok"
if any error or fatal events where flagged).

The analyzer also comes with a reporter which can be used to log events of
interest. The analyzer and the reporter is used by buster-test-cli and
extensions to provide various insight about your code. Examples of practical
usage includes linting and syntax checking (for browser tests).


buster-args
-----------

Status:
    Stable, has a few known (API design) issues waiting to be fixed

Source code:
    :repo:`buster-args`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-args" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-args.png">
        </a>

General purpose command line argument parser. Only parses command line options,
no printing to the console, no ``--help`` generation, no flow control. Also
tries as best it can to adhere to UNIX conventions. Fails early (typically when
using non-existent options ++).


buster-assertions
-----------------

Status:
    Stable, awaiting a few additions before 1.0

Source code:
    :repo:`buster-assertions`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-assertions" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-assertions.png">
        </a>

Assertions and expectations, for Buster.JS and everyone else.


buster-autotest
---------------

Status:
    *TODO*

Source code:
    :repo:`buster-autotest`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-autotest" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-autotest.png">
        </a>

*TODO Write description*


buster-bayeux-emitter
---------------------

Status:
    Stable

Source code:
    :repo:`buster-bayeux-emitter`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-bayeux-emitter" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-bayeux-emitter.png">
        </a>

Given ``subscribe`` and ``publish`` methods, this module produces an object
that looks and behaves like an event emitter (i.e. no specific requirements on
event names and so on).

Specifically, the bayeux emitter is used to allow the test runner in the
browser (via ``buster-capture-server``) ship its progress events directly over
the wire (which is a Bayeux wire).


buster-capture-server
---------------------

Status:
    Unstable, currently undergoing API changes.

Source code:
    :repo:`buster-capture-server`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-capture-server" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-capture-server.png">
        </a>

The capture server captures browsers as slaves, and offers a completely generic
API for carrying out work across those slaves. A workload is known as a
"session", and a test run is typically a session. Other uses include for
instance synced-across-devices slide shows (for which a POC has been built).

In general, the server knows nothing specifically of testing. It knows how to
accept and server resource sets, capture and command browser slaves, and
coordinate every piece using messaging (Bayeux on the HTTP level).


buster-cli
----------

Status:
    Stable

Source code:
    :repo:`buster-cli`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-cli" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-cli.png">
        </a>

Somewhat arbitrary collection of utilities useful to CLIs that aim to behave
more or less like existing Buster.JS CLIs. Is used by ``buster-test-cli`` and
``buster-static``.


buster-client
-------------

Status:
    Unstable, about to be merged into buster-capture-server

Source code: :repo:`buster-client`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-client" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-client.png">
        </a>

To be merged into ``buster-capture-server``. Implements a simple HTTP client
for buster-capture-server's HTTP API. Is used by ``buster-test-cli`` to
configure and create a session (remember, a generic work load, typically a test
run).


buster-configuration
--------------------

Status:
    Stable. Occasionally learns about new properties.

Source code:
    :repo:`buster-configuration`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-configuration" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-configuration.png">
        </a>

Programmatic access to ``buster.js`` configuration files. Allows you to extract
``resourceSets`` (i.e. all the file names/contents), environment options, run
extension hooks and filter out groups.


buster-core
-----------

Status:
    Stable

Source code:
    :repo:`buster-core`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-core" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-core.png">
        </a>

Somewhat arbitrary collection of functions used in several other buster
modules. Includes the event emitter implementation used throughout, some
limited flow-control utilities, and a few functional enhancements. Hopefully,
we can get rid of this one day.


buster-evented-logger
---------------------

Status:
    Stable

Source code:
    :repo:`buster-evented-logger`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-evented-logger" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-evented-logger.png">
        </a>

A logger-like utility that simply emits events. This is useful in any number of
cases, most importantly when running tests in browsers via
buster-capture-server. In this case, we pass the events over the wire instead
of printing them to the console.


buster-format
-------------

Status:
    Stable

Source code:
    :repo:`buster-format`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-format" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-format.png">
        </a>

ASCII formatting of arbitrary JavaScript objects. This module is used to give
pretty feedback in certain cases. It is used to format objects in assertion
error messages, to format objects passed to ``buster.log`` (and
``console.log``, if captured) and may be used in more places later. Also
intended for reuse outside of the Buster.JS sphere.


buster-glob
-----------

Status:
    *TODO*

Source code:
    :repo:`buster-glob`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-glob" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-glob.png">
        </a>

*TODO Write description*


buster-resources
----------------

Status:
    Stable, has a few known issues waiting to be fixed

Source code:
    :repo:`buster-resources`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-resources" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-resources.png">
        </a>

Represents files in a project that may be included in a test run. For Node.js,
Buster.JS only use ``buster-resources`` to look up which paths to ``require``.
For browsers, Buster.JS uses ``buster-resources`` to build a virtual file
system, send it over HTTP and mount it on the server. All of these components
are available in this module.

``buster-resources`` also includes intelligent caching of resources to allow
test runs that only reads changed tests from file and so on. Resources
typically map to files on disk, but really can be anything, including one-off
strings in a configuration file.


buster-sinon
------------

Status:
    Stable

Source code:
    :repo:`buster-sinon`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-sinon" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-sinon.png">
        </a>

Integrating Sinon.JS with Buster.JS. Adds Sinon specific assertions, wires up
Sinon.JS to use ``buster-format`` for error messages, adds automatic
sandboxing/restoration of fakes for test cases and so on.


buster-static
-------------

Status:
    Largely incomplete

Source code:
    :repo:`buster-static`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-static" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-static.png">
        </a>

A small and (currently, too) simple/limited way of easily running tests
directly in a browser (i.e. without buster-server). Builds scaffolding markup
and serves tests on a simple server.


buster-stdio-logger
-------------------

Status:
    Stable

Source code:
    :repo:`buster-stdio-logger`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-stdio-logger" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-stdio-logger.png">
        </a>

Accepts a standard and error output stream, and returns a
``buster-evented-logger`` object that will print certains events directly to
the passed-in stdout, and certain errors to stderr.


buster-syntax
-------------

Status:
    Stable, but integrates with ``buster-analyzer``, which is not.

Source code:
    :repo:`buster-syntax`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-syntax" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-syntax.png">
        </a>

A small extension (but installed and activated by default) that provides server
side syntax checking of scripts sent for testing with
``buster-capture-server``. When Buster.JS loads scripts in browsers, the
browser in question will be the one responsible for the level of detail when
errors arise, Syntax checking on the server allows us to catch these errors in
one place, and produce a pretty nice report, regardless of browser intended to
run the tests.


buster-terminal
---------------

Status:
    Stable, mostly complete.

Source code:
    :repo:`buster-terminal`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-terminal" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-terminal.png">
        </a>

A small library for working with `ANSI escape sequences
<http://en.wikipedia.org/wiki/ANSI_escape_code>`_  in the terminal. Mostly used
for colored output, and positional output. Also includes a "labeled list"
object that is used to progressively print multiple lines of output at once,
e.g. when running tests on multiple browsers (the dots reporter).



buster-test
-----------

Status:
    May be split into several modules and/or renamed.

Source code:
    :repo:`buster-test`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-test" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-test.png">
        </a>

Implements ``testCase``, ``describe`` (and friends), the actual test runner,
reporters and supporting objects. ``buster-test`` is centered around the
concept of "test contexts", which is just a bag of tests, and possibly more
bags of tests. This is the shared data format produced by both the xUnit and
BDD style tests/specs.

The reason we're considering breaking up this module is that it includes parts
that are complete and unlikely to change (such as test case and spec
definitions, the context data format and the test runner) <strong>and</strong>
parts that are likely to change and/or have abilities added, such as reporters.
The name also indicates it is what powers the ``buster-test`` binary, which is
not true.


buster-test-cli
---------------

Status:
    In development

Source code:
    :repo:`buster-test-cli`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-test-cli" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-test-cli.png">
        </a>

"The kitchen sink" behind ``buster test``. Coordinates many other modules to
read configuration file, loop all matching groups, creating runners and running
those groups. In charge of options passed to ``buster test``, colored printing
and so on.

This module is mostly stable, but is rapidly gaining features and extension
points. My gut feeling tells me that this module houses too many things, and it
will likely be broken up before we go 1.0.


buster-user-agent-parser
------------------------

Status:
    Stable (new user agents occasionally added)

Source code:
    :repo:`buster-user-agent-parser`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-user-agent-parser" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-user-agent-parser.png">
        </a>

A generic user-agent parser that does a best-effort attempt at extracting
browser, version and platform. Only used for "friendly" browser names in
test result reports, list of slaves and so on.


fs-watch-tree
-------------

Status:
    *TODO*

Source code:
    :repo:`fs-watch-tree`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/fs-watch-tree" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/fs-watch-tree.png">
        </a>

*TODO Write description*


Auxilliary modules
==================

buster-dev-tools
----------------

Status:
    In development, awaiting Windows support

Source code:
    :repo:`buster-dev-tools`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-dev-tools" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-dev-tools.png">
        </a>

Allows developers to set up their Buster.JS development environment quickly
and painlessly.


buster-docs
-----------

Status:
    Will never be "done"

Source code:
    :repo:`buster-docs`

You're reading them.


buster-util
-----------

Status:
    Stable, but will hopefully be removed down the line

Source code:
    :repo:`buster-util`

Contains a simple and ugly test runner that's used to test some of the more
fundamental parts of Buster.JS.


Extensions and optional modules
===============================


buster-amd
----------

Status:
    In development

Source code:
    https://github.com/johlrogge/buster-amd

*Work in progress*. Extension that will allow AMD projects to use
Buster.JS without any specific configuration. It modifies the load path
of the ``resourceSet`` used to represent user files and creates
an anonymous AMD module that depends on all tests, thus loading files
using an AMD loader rather than simple script tags. Currently developed by
`Joakim Ohlrogge <https://github.com/johlrogge>`_.


buster-coffee
-------------

Status:
    Stable, but future changes may be required to support Node.js and
    ``require()``

Source code:
    https://github.com/jodal/buster-coffee

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/jodal/buster-coffee" class="travis">
          <img src="https://secure.travis-ci.org/jodal/buster-coffee.png">
        </a>

Extension that automatically compile CoffeeScript files before running tests.
In its current state, this extension does not work for files that are to be
included using ``require()``, and is thus not very useful for Node.js projects.
Currently developed by `Stein Magnus Jodal <https://github.com/jodal>`_.


buster-coverage
---------------

Status:
    In development

Source code:
    https://github.com/ebi/coverage-helpers

*Work in progress*. Extension to calculate line coverage. Uses the
``resourceSet`` to instrument code, and emits custom messages over the test
runner to build up the report. Currently developed by `Tobias Ebnöther
<https://github.com/ebi>`_.


buster-html-doc
---------------

Status:
    Stable

Source code:
    :repo:`buster-html-doc`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-html-doc" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-html-doc.png">
        </a>

An extension that implements "markup-in-comments", using the
``/*:DOC el = ... */`` format originally found in JsTestDriver.  The extension
was originally developed to be API compatible with JsTestDriver in the
``buster-jstestdriver`` extension, but works well with vanilla Buster.JS test
cases (and specs) too.


buster-jstestdriver
-------------------

Status:
    Stable, but lacks async test cases.

Source code:
    :repo:`buster-jstestdriver`

Build status:
    .. raw:: html

        <a href="http://travis-ci.org/busterjs/buster-jstestdriver" class="travis">
          <img src="https://secure.travis-ci.org/busterjs/buster-jstestdriver.png">
        </a>

An extension that allows Buster.JS to run JsTestDriver test suites, given a
configuration file Buster.JS understands.


buster-lint
-----------

Status:
    Stable, but relies on ``buster-analyzer``, which is not.

Source code:
    `buster-lint <https://github.com/magnars/buster-lint>`_

Extension that enables the integration of JsLint and JsHint by way of
`autolint <https://github.com/magnars/autolint>`_. Using the
``buster-analyzer`` module, the lint extension is able to flag lint errors as
"error" in buster. This allows the end-user to choose if lint errors should
only be printed as warnings, or actually fail the build (which can be achieved
with ``buster test -F error``). Currently developed by `Magnar Sveen
<https://github.com/magnars>`.


By example: ``buster test --browser``
=====================================

This section runs through what happens when you automate browser tests from the
command line, e.g. when you type something like ``buster test --browser``. The
idea is to highlight roughly the flow through the various parts of Buster.JS,
and to illustrate practically how the modules depend on and interact with each
other.

In this section, files are referred to as ``package/path/to/file``, meaning
that ``buster/lib/buster/buster-wiring.js`` refers to the file
`lib/buster/buster-wiring.js`_ in the `buster package`_.

.. _lib/buster/buster-wiring.js: https://github.com/busterjs/buster/blob/master/lib/buster/buster-wiring.js
.. _buster package: https://github.com/busterjs/buster


The binary
----------

``buster test`` executes the "binary" script `buster/bin/buster`_ This is a
small wrapper script that can print some help, and that can look for other
commands on the path called ``buster-<something>``. In this case, it finds the
`buster/bin/buster-test`_ script in the same package. The ``buster`` package is
a "meta package", meaning that it does not contain much implementation, it's
just there to glue all the pieces together and give you a convenient install
target.

.. _buster/bin/buster: https://github.com/busterjs/buster/blob/master/bin/buster
.. _buster/bin/buster-test: https://github.com/busterjs/buster/blob/master/bin/buster-test


Command line options
--------------------

The ``buster-test`` "binary" simply delegates to
`buster-test-cli/lib/buster-test-cli/cli/test.js`_ which defines the CLI
interface for running tests. Command line options are handled by
``buster-args``, and to some extend, ``buster-cli``.

.. _buster-test-cli/lib/buster-test-cli/cli/test.js: https://github.com/busterjs/buster-test-cli/blob/master/lib/buster-test-cli/cli/test.js

`buster-cli/lib/buster-cli.js`_ is not so much a real abstraction, as it is a
collection of routines useful in buster CLIs. It centralizes help text
formatting, provides helpers for adding CLI options with help text, locates the
configuration file and coordinates loading it with running.

.. _buster-cli/lib/buster-cli.js: https://github.com/busterjs/buster-cli/blob/master/lib/buster-cli.js

The ``--browser`` option is a buster-args shorthand that expands to
``--environment browser``, which is the long form for specifying environment.


Loading configuration
---------------------

The configuration file is located and "resolved" in
`buster-cli/lib/buster-cli.js`_.  It tries to find the configuration file in
one of ``./``, ``./test/`` or ``./spec/``. If it is not found, the parent
directory will be consulted in the same way until we're at the root.

.. _buster-cli/lib/buster-cli.js: https://github.com/busterjs/buster-cli/blob/master/lib/buster-cli.js

If the ``--config`` option was provided, only that file will be
consulted. ``buster-cli`` contains some error handling in case
configuration could not be located.

For loading the contents of the configuration file into memory, a separate
package, ``buster-configuration``, is used. Buster.JS defers actually reading
source files from disks as long as possible, so "resolving" the configuration
file only loads relevant groups with their extensions and builds lazy `resource
sets`_ to represent files.  ``buster-cli`` uses several options to filter out
the groups found in the configuration file to figure out which ones will
eventually be run.

.. _resource sets: https://github.com/busterjs/buster-resources/blob/master/lib/resource-set.js


Detour: Extension hooks
-----------------------

A configuration group has a method called ``runExtensionHook``.  You call this
method with the name of a hook and some arguments. Any extension in the
configuration that has a method of the same name will then be called with the
passed in arguments.


Loading the browser runner
--------------------------

Depending on what groups resulted from reading the configuration file and
filtering it according to command line options, the following steps may be
repeated several times. For simplicity, this example assumes only one
configuration was loaded.

Now that ``buster-test-cli`` knows that we're running tests for the browser
environment, it loads `the browser runner`_. The runner will have its ``run``
method called with the configuration loaded from file, an options object, which
contains prepared options for things like color etc, and a callback that will
be called when the run is over.

.. _the browser runner: https://github.com/busterjs/buster-test-cli/blob/master/lib/buster-test-cli/cli/runners/browser-runner.js

The runner now uses a little abstraction that is shared between the browser and
the node runner. It creates an `analyzer`_ for general-purpose health-checks,
and fires the ``"beforeRun"`` extension hook, allowing extensions to register
analyzers.

.. _analyzer: https://github.com/busterjs/buster-analyzer/blob/master/lib/analyzer.js

The browser runner then proceeds to instantiate a
`buster-client/lib/client.js`_. This object is a JavaScript interface that
speaks HTTP to a running buster server. Because the server component is
currently being reworked, this document will only briefly touch on the concepts
it implements.

.. _buster-client/lib/client.js: https://github.com/busterjs/buster-client/blob/master/lib/client.js


The server: A brief overview
----------------------------

The server has the ability to capture browsers as slaves. A slave is a browser
that has loaded a frameset, where one frame, "the control frame", keeps a
persitent connection to the server, awaiting instructions. The server also
provides an HTTP API for creating a session - a piece of work to be carried out
in available slaves. When this happens, the server uses the bidirectional
connection to instruct slaves to load the session in a separate frame.

When loading a session in a browser, an index.html file is loaded in a separate
frame, and this file will include ``<script>`` tags that loads all the files
originally specified in the configuration under ``libs``, ``sources``,
``testHelpers`` and ``tests``.


The browser part of the server
------------------------------

Alongside the sources, a little `wiring script`_ is loaded. This file
configures a listener for new `test cases`_ and `specs`_ Finally it wires up a
`test runner`_ with a `JSON proxy reporter`_ and defines ``buster.run()`` as a
way to start the whole thing. The test runner is completely evented, and the
JSON proxy reporter is just a way of making sure the events are only data, thus
HTTP-encodable. The events from the test runner are sent directly over the
wire.

.. _wiring script: https://github.com/busterjs/buster-test-cli/blob/master/lib/buster-test-cli/browser/wiring.js
.. _test cases: https://github.com/busterjs/buster-test/blob/master/lib/buster-test/test-case.js
.. _specs: https://github.com/busterjs/buster-test/blob/master/lib/buster-test/spec.js
.. _test runner: https://github.com/busterjs/buster-test/blob/master/lib/buster-test/test-runner.js
.. _JSON proxy reporter: https://github.com/busterjs/buster-test/blob/master/lib/buster-test/reporters/json-proxy.js

Back on the client
------------------

Back on the client, ``buster-test-cli`` is now ready to use its HTTP client to
create a session. The client starts by asking the server for available cache
manifests. These will be handed to the ``resourceSet``, and will make sure
Buster does not read any files from disk that are already hosted in the same
version on the server.

Any file that isn't already cached will now be "serialized" (i.e. read from
disk) and sent to the server as part of the HTTP POST request to create a
session. The server uses a `resource set cache`_
to cache and look up cached resources, and a `resource set middleware`_
to actually serve them over HTTP.

.. _resource set cache: https://github.com/busterjs/buster-resources/blob/master/lib/resource-set-cache.js
.. _resource set middleware: https://github.com/busterjs/buster-resources/blob/master/lib/resource-middleware.js

With the session readily created, ``buster-test-cli``'s browser runner is
listening for messages. These messages are piped into its `remote runner`_.
This object accepts messages from multiple test runners (i.e. one per browser),
and emits messages as if it was one test runner. The originating browser is
represented as an outer context for all tests. This allows the "remote runner"
to be used directly with any existing reporter written for the regular test
runner.

.. _remote runner: https://github.com/busterjs/buster-test-cli/blob/master/lib/buster-test-cli/test-runner/remote-runner.js


The "testRun" extension hook
----------------------------

After the remote runner has been initialized, but before the tests are actually
started, the client issues the ``"testRun"`` extension hook, which allows
extensions to interact with the test runner (e.g. to listen to specific
messages etc).


Finishing up
------------

When the session is created and the remote runner is initialized, the browser
runner will listen for the test runner's ``"suite:end"`` event. This event
comes with a short summary, which is passed to the browser runner's ``done``
callback (passed to ``run``).

The ``test.js`` CLI interface will now use the test report to decide if the run
was successful or not and exit with a corresponding exit code. In the case
where there are more configuration groups to be run, these will be run before
exiting.


In summary
==========

This is of course a brief and incomplete overview, but it should provide some
insight into how some of the more important parts work together.
