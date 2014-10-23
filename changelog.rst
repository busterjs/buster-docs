.. highlight:: javascript

=========
Changelog
=========

Here you find details about what has changed with each release of Buster.JS.

v0.7.16
=======

Released 2014-10-23.

- `buster-autotest <https://github.com/busterjs/buster-autotest>`_
  uses now `chokidar <https://www.npmjs.org/package/chokidar>`_ instead of
  `fs-watch-tree <https://www.npmjs.org/package/fs-watch-tree>`_


v0.7.15
=======

Released 2014-10-20.

- Fix for issue `#396 - Async test case continues to execute after assertion failure <https://github.com/busterjs/buster/issues/396>`_.
- `handleUncaughtError now allows more than 3 arguments <https://github.com/busterjs/buster/pull/423>`_.
- :ref:`buster-ci`


v0.7.14
=======

Released 2014-09-17.

- Fix for issue `#416 - buster-server crash with IE 11 on W7 only if there is two browsers captured <https://github.com/busterjs/buster/issues/416>`_.


v0.7.13
=======

Released 2014-05-05.

- Necessary modification for refactoring of buster-test (Remove runtime throttler and pre-event runtime).


v0.7.12
=======

Released 2014-04-30.

- Fix for issue `#404 - Add missing Sinon.JS behavior module <https://github.com/busterjs/buster/issues/404>`_.
- Expose buster.sinon.match for node.js


v0.7.11
=======

Released 2014-04-04.

- Sinon version ~1.9


v0.7.10
=======

Released 2014-03-19.

- Fix for issue `#401 - env: node\r: No such file or directory <https://github.com/busterjs/buster/issues/401>`_.


v0.7.9
======

Released 2014-03-17.

- Fix for issue `#400 - IE <= 8 throwing error: Object doesn't support this action <https://github.com/busterjs/buster/issues/400>`_.


v0.7.4
======

Released 2013-09-17.

- New ``buster-server``, aka `Ramp <https://github.com/busterjs/ramp>`_. Vastly
  improved stability, better handling of misbehaving clients, faster.
- Windows support; installs and runs cleanly on Windows
- assert.equals now handles cyclic objects
- assert.equals no longer coerces arguments, so assert.equals("10", 10); used to
  pass, but will now fail
- The test runner now uses and supports providing random seeds for test ordering
- Allow to specify files to be excluded in config file (:issue:`292`)
- Extact configuration values from query string when running static browser tests
- Almost half of the modules that make up Buster are now stable 1.x.y versions
- New default console reporter (dots reporter is gone)
- Test runner has new event suite:configuration that provides info on runtime
  (i.e. Browser, Node version), expected number of tests, random seed.
- Tons of bug fixes

Breaking changes
----------------

- Sub-commands such as ``buster test`` are no longer supported, use the dashed
  versions ``buster-test``.
- The property ``environment`` is no longer set to ``browser`` by default, it
  must be explicitly set in all configuration groups.
- ``assert``, ``refute`` and other globals or gone. Buster only exposes the
  ``buster`` global now.

A quick work-around for the now missing globals is to create ``test/helper.js``
with

.. code-block:: js

    var assert = buster.assert;
    var refute = buster.refute;
    var expect = buster.expect;

And then add this to your configuration file:

.. code-block:: js

    module.exports["My config"] = {
        environment: "browser",
        sources: [...],
        tests: [...],
        testHelpers: ["test/helper.js"]
    };

Bug fixes
---------

- ``sources`` key in config file isn't parsed correctly when extending base configuration (:issue:`222`)
- when using run the suite name is undefined (:issue:`238`)
- beforeAll is not working properly with nested descriptions (:issue:`250`)
- Failed creating session: EISDIR, read (:issue:`256`)
- ``toEqual`` goes into infinite recursion for cyclic data (:issue:`258`)
- buster-test returns undefined, when you use not known configuration key (:issue:`267`)
- defer should work the same as "focus rocket" (:issue:`280`)
- HTML runner displays undefined for test names (:issue:`300`)
- async test returning resolved promise with truthy value is treated as an error (:issue:`308`)
- Tests being skipped when extending ``Object.prototype`` (:issue:`342`)


v0.6.13
=======

Released 2013-09-16.

A frozen version of the 0.6.x series; locks all dependencies at specific versions.

v0.6.12 (formerly: v0.6.3)
==========================

Released 2012-12-22.

Update capture-server and use new implementation, "ramp". This should
vastly improve the stability of the server as well as print proper
error messages (and use correct exit codes) when the server is not
running or has no connected slaves.

This release also introduces a few of the 1.0-ready modules slated for
0.7, but few user-facing updates.

Breaking changes
----------------

No breaking changes in this release.

Additions
---------

No additions in this release.


v0.6.11 (formerly: v0.6.2)
==========================

Released 2012-12-22.

Minor fix.

Breaking changes
----------------

No breaking changes in this release.

Additions
---------

No additions in this release.

Bug fixes
---------

- Exit code was always 1 (:issue:`221`)


v0.6.2 - v.0.6.10
=================

To be ignored.


v0.6.1
======

Released 2012-07-09.

Buster.JS 0.6.1 is a fairly small maintenance release, mostly correcting a
bunch of bugs of minor/medium significance.

Breaking changes
----------------

No breaking changes in this release.

Additions
---------

Buster.JS 0.6.1 ships with Sinon.JS 1.4.0, a significant update with lots of
interesting new features, see `Sinon.JS changelog
<http://sinonjs.org/Changelog.txt>`_.

Bug fixes
---------

- Cyclic objects in buster-format (:issue:`215`)

- Exit code 1 for wrong arguments (:issue:`210`)

- ``assert.equals`` and Prototype.js arrays (:issue:`206`)

- Focus rocket on test case name (:issue:`200`)

- Configure ``this.timeout`` in ``setUp`` and ``prepare`` (:issue:`199`)

- Red status line when there are timeouts (:issue:`196`)

- Exit code 1 when no tests are run (:issue:`195`)

- ``assert.match`` with empty strings now passes (:issue:`178`)

- Autotest and symlinks (:issue:`168`)

- "Too much recursion" when combining stubs and cyclical data structures
  (:issue:`124` and :issue:`201`)

- Clean up dangling proxy requests when test run completes (:issue:`117`)

- Acknowledge Sinon mock expectations as assertions (:issue:`62`)

- posix-argv-parser: Unknown short options "with extras" (i.e. ``-node``) fails
  with a humanized error message.


v0.6.0 -- Buster.JS Beta 4
==========================

Released 2012-06-20.

Beta 4 packs a lot of changes, increased stability and new features. Tests
written for older versions do not need any syntactical updates, while
extensions and other "general API consumers" *may*.

Documentation is currently lacking. There will be a documentation sprint prior
to 1.0, but probably not before the next beta. For planned progress, refer to
:ref:`roadmap`.

Breaking changes
----------------

This is a list of breaking changes in this release. Since we haven't reached
1.0 stable yet, we're taking the freedom to change APIs without making them
backwards compatible in the hope of making them better. There are a few more
breaking changes planned for the next (last) beta, see :ref:`roadmap`.

Naming changes
^^^^^^^^^^^^^^

In an effort to improve navigation in the many Buster.JS modules, we have
started renaming some of them, as discussed `on the mailing list
<http://groups.google.com/group/busterjs-dev/browse_thread/thread/454146b98e69eef9>`_.
These naming changes will only affect you if you are depending on either of
these modules in your own projects.

- buster-resources is now `ramp-resources
  <https://github.com/busterjs/ramp-resources>`_ (the capture server will
  eventually become "ramp")
- buster-args is now `posix-argv-parser
  <https://github.com/busterjs/posix-argv-parser>`_
- buster-stdio-logger is now `stream-logger <https://github.com/busterjs/stream-logger>`_
- sinon-buster is now `buster-sinon
  <https://github.com/busterjs/buster-sinon>`_

Command line interface ``buster-test``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

``--log-all`` is gone. In Beta 3, Buster.JS would silence log messages for
passing tests and this option would show all messages. In Beta 4, Buster.JS
shows all messages by default, and silences those from passing tests with
``--quiet-log``.

Deprecated modules
^^^^^^^^^^^^^^^^^^

Some modules are no longer needed and will not receive further upgrades:

- buster-client
- buster-bayeux-emitter

Extension hooks
^^^^^^^^^^^^^^^

Hooks fire in a given order. The ``beforeRun`` no longer comes with
any arguments. To get hold of the ``analyzer`` and ``configuration`` objects
that used to be passed to it, implement ``analyze(analyzer)`` and
``configure(configuration)`` (called in that order) in addition.

New features
------------

The main theme of this release is a rewritten and vastly more stable capture
server. Significant work has also been put into making it easy to use the
server and the related command-line interfaces with any test framework (e.g.
it should now be possible to use these tools to create a ``qunit-test``
binary that runs QUnit tests over the server).

Command-line interface ``buster-test``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- ``--full-stacks`` disables the stack filter that's used to hide Buster.JS
  internals from stack traces.

- Implementation and API-wise, the ``buster-test-cli`` module is now completely
  test framework-agnostic. The framework sources are injected as an extension
  in the "binary" script that uses. In other words, the Buster.JS test
  framework is now just a regular extension to the Buster.JS CLI tools.
  For an example, see `buster-test
  <https://github.com/busterjs/buster/blob/v0.6.0/bin/buster-test>`_.

Command-line interface ``buster-server``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

`This CLI <https://github.com/busterjs/buster/blob/v0.6.0/bin/buster-server>`_
is now backed by `a dedicated module
<https://github.com/busterjs/buster-server-cli>`_ that supports skinning and
customization.

npm test
^^^^^^^^

All modules now have a working ``npm test``. All modules are also configured
with continuous integration on Travis CI, but will need further love to make
the setups work nicely on Travis (basically we have some ugly circular
dependencies that needs to be done away with).

Analyzer improvements
^^^^^^^^^^^^^^^^^^^^^

The analyzer is the object that is used for quality assurance metrics, such as
the lint extension.

- Errors can be objects with either a ``content`` or a ``message`` property for
  the error message. Support for ``message`` is new.

- In addition to "OK" and "failed", the analyzer can now have an "unclean"
  state, which means it's passing, but did receive non-fatal warnings or
  errors.

Autotest improvements
^^^^^^^^^^^^^^^^^^^^^

The autotest module has seen significant improvements through Magnar Sveen's
work on `fs-watch-tree <http://github.com/busterjs/fs-watch-tree>`_.  The
autotest command-line interface itself also received some usability upgrades.
Autotest should now work flawlessly on Linux and OSX (Windows unconfirmed at
this point).

- Re-run all tests by tapping Ctrl-C. Hit Ctrl-C twice to stop. Currently only
  works for ``buster-autotest``, not ``buster autotest``.

- Screen is cleared between each run.

Ramp resources improvements
^^^^^^^^^^^^^^^^^^^^^^^^^^^

- Don't put duplicate objects in the cache

- Individual resources have cacheable: true|false. This means extensions can
  control cacheability (i.e. repeatability for warnings etc) on a very
  fine-grained level.

- Resource Etag changes when adding processors. Avoids caching issues: If an
  extension is added in a configuration file, the cache manifest would not
  update. With this change, any extension that adds processors will cause the
  cache manifest for affected resources to update, avoiding any stale cache
  lookups.

- Propagate resource content processor exceptions.

- Root resources can specify where to insert scripts by adding ``{{scripts}}``
  to the template contents.

- Improve error message for missing paths.

- Path normalization now accounts for Windows paths.

- Only globbing once for ``appendLoad`` and ``prependLoad``.

buster-test improvements (focus rocket!)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

- Focus rocket: Sort of the opposite of a deferred test. Prepend any test name
  with the focus rocket "=>" and only tests with the rocket will run. See `this
  short screencast on it <http://ascii.io/a/548>`_.

- The dots reporter tracks elapsed time.

- ``buster.testContext`` is now an event emitter, and::

      buster.testContext.on("create", function () {});

  takes over for::

      buster.testCase.onCreate(function () {});

  and::

      buster.spec.onCreate(function () {});

``~/.buster.js``
^^^^^^^^^^^^^^^^

The buster.js configuration file you put in your projects has a strict focus
on project-related settings. This means that it intentionally does not support
personal preferences like ``--color dim``. This is where ``~/.buster.js`` (or
``~/.buster.d/index.js`` if you prefer) enters.  Currently the following
settings can be provided:

- ``test.releaseConsole``. If ``true``, never capture the console.

- ``test.quietLog``. If ``true``, never print log messages for passing tests.

- ``test.color``. One of "dim", "bright" (default) or "none".

To specify preferences, ``~/.buster.js`` (or (``~/.buster.d/index.js``) should
look like this::

    module.exports = {
        "test.color": "dim"

        // More settings as needed
    };

Partial Windows support
^^^^^^^^^^^^^^^^^^^^^^^

Windows support work is ongoing. In this version, Node tests with the
``buster-test`` command-line interface is working, while the server and browser
automation part is still not quite there. If you need Windows support, please
consider chipping in.

Argv parsing
^^^^^^^^^^^^

buster-args is now posix-argv-parser and has an overhauled API. Highlights:

- Support for transforms

- Support for types

- New, close-to-stateless API

Various additions
^^^^^^^^^^^^^^^^^

- buster-core Event emitter: it is now safe to remove a listener inside a
  listener.

- buster-core Event emitter: It is now possible to subscribe to all events with
  one call, ``obj.on(function (event, data) {});``

- buster-core: Extracted tmpFile method from buster-configuration.

- buster-format Bug fix: hasOwnProperty issue on IE9.

- buster-lint: Prevent caching of files containing lint.

- buster-sinon: callOrder accepts array of spies.


v0.5.3
======

Released 2012-05-04.

Breaking changes
----------------

- *TODO Fill out*

Additions
---------

- *TODO Fill out*

Bugs
----

- *TODO Fill out*


v0.5.2
======

Released 2012-05-02.

Breaking changes
----------------

No breaking changes in this release.

Additions
---------

- Allow ``--config/-c`` for ``buster test`` to accept a comma separated list of
  configuration files. (:issue:`171`)

- Capture browser page displays how many browsers in total are captured.

Bugs
----

- buster-glob requires a newer glob, which solves a problem with same glob
  patterns in different working directories.

- Use ``path.join`` for cross-platform paths (only partially solved)


v0.5.1
======

Released 2012-04-26.

Breaking changes
----------------

No breaking changes in this release.

Additions
---------

- Only log messages (``buster.log``) for failed tests by default log all with
  ``--log-all``/``-L`` (:issue:`163`)

- Added more detailed information about OS (Sasha Depold,
  `buster-user-agent-parser #1
  <https://github.com/busterjs/buster-user-agent-parser/pull/1>`_,
  `buster-test-cli #1 <https://github.com/busterjs/buster-test-cli/pull/1>`_)

Bugs
----

- ``assert.same`` now is compatible with ES Harmony "egal". ``assert.equals``
  recognizes ``NaN`` as equal to ``NaN``. (:issue:`162`)


v0.5.0 -- Buster.JS Beta 3
==========================

Released 2012-04-17.

Breaking changes
----------------

This is a list of breaking changes in this release. Since we haven't reached
1.0 stable yet, we're taking the freedom to change APIs without making them
backwards compatible in the hope of making them better.

- ``testLibs`` removed, ``testHelpers`` added (:issue:`95`)

  This is a simple change of words. ``testHelpers`` resonates better with most
  uses of the property than ``testLibs``. It behaves like before, meaning that
  e.g. when you run single tests with ``buster test -t test/my-test.js``,
  everything in ``testHelpers`` will still be loaded.

- Some expectations changed names (:issue:`91`)

  We're renaming some expectations, basically to match the expectations in
  Jasmine. We were already pretty close to their API, and being 1:1 means way
  easier migration. Some expectations have also been added, you can find them
  in the "Changes" section below.

  - ``toBeSameAs`` is now ``toBe``. Example: ``expect(true).toBeTruthy()``

  - ``toBeInDelta`` is now ``toBeNear``, aliased to ``toBeCloseTo``. Example:
    ``expect(4.5).toBeCloseTo(4, 0.5)``

  - ``not()`` is now a property, not a function. Example:
    ``expect(false).not.toBeTruthy()``

- Removed assertion

  ``assert.typeOf`` was removed in favor of the more specific ones (e.g.
  ``assert.isString``)

- ``buster.env.path`` is removed

    Use ``buster.env.contextPath`` (was also available before beta 3) instead.
    Note that ``buster.env.contextPath`` does not include a trailing slash.


Additions
---------

- buster-autotest works on all platforms where ``fs.watch`` is supported.
  Autotest is also slightly clever, only running affected tests on each save
  and running the entire suite when going from red to green.

- Adding support for JsTestDriver style
  ``/*:DOC+=<div>test</div>*/`` with the new extension :ref:`buster-html-doc`.
  This extension can be used both in vanilla buster tests and alongside
  :ref:`buster-jstestdriver`. (:issue:`47`)

- The body of the testbed HTML in browser tests will now reset between each
  test run. It will not be cleared out entirely, it will be set to what it was
  initially. Note: this is not yet fixed in :ref:`buster-static`. (:issue:`74`)

- Added new expectations ``toContain``, ``toBeTruthy`` and ``toBeFalsy``.
  (:issue:`91`)

- Added new assertion ``contains`` (:issue:`91`)

- Added new CLI option, ``--release-console``, to ``buster test``. Buster now
  proxies all ``console`` loggings to ``buster.log`` by default, and you can
  use this setting to disable it. (:issue:`96`)

- Highlighting uncaught exceptions with colors to make them stand out.
  (:issue:`105`)

- The reporters now let you know if a timeout happened in ``setUp``,
  ``tearDown`` or in the test itself. (:issue:`12`)

- Proper exit codes for failing tests and other error situations (``buster
  test``) (:issue:`81`)

Bugs
----

- Fixed some bugs in server proxying for browser tests (:issue:`57`)

- Browser tests now fail when a test times out when there are successful tests
  in the same test run. (:issue:`77`)

- Browser tests now fail when there's no assertions in a test. (:issue:`69`)

- ``buster.log(function(){});`` would log undefined, as it called the function
  because of internals in buster-evented-logger. It no longer calls the
  function, and logs what you'd expect it to log. (:issue:`94`)

- Asserts are now counted properly in the JsTestDriver extension. (:issue:`49`,
  :issue:`31`)

- At some point in time, an unknown change fixed a small problem with
  ``assert.calledOnce``. Nobody knows what, where and why. (:issue:`70`)

- No longer running setUp/tearDown for deferred tests. (:issue:`107`)

- Chrome no longer periodically reloads the entire slave frameset when the tab
  is in the background. (:issue:`84`)

- Browser tests fail properly when there's no assertions in a test.
  (:issue:`69`)

- buster-static now properly made available when installing buster
  (:issue:`43`)

- Supporting ``"// deferred tests"`` in the BDD syntax as well. (:issue:`55`)

- Removing the use of ``Array.some`` and ``Object.create`` in browser code, for
  old browser compat. (:issue:`121`, :issue:`120`)

- ``extends`` on config groups now also copy extensions and other custom
  configurations. (:issue:`100`)

- Failing assertions are counted as assertions by the test runner.
  (:issue:`87`)

- Only installing one version of Sinon. (:issue:`14`)

- ``toBeCalledWith`` expectation now works when the stub/spy is called multiple
  times. (:issue:`82`)

- Properly counting assertions in buster-jstestdriver. (:issue:`49`)

- Making jstestdirver.jQuery available in buster-jstestdriver. (:issue:`48`)

- Now failing for non-existant files in the config file. (:issue:`78`)

- Status code is now non-zero when ``buster test`` fails with test errors etc.
  (:issue:`81`)

- Dot reporter wraps lines. (:issue:`32`)

- No longer warning with syntax error for files where the last line is a
  comment. (:issue:`144`)

- Fixing ``assert.exception`` failures causing stack overflows. (:issue:`63`)

- Logging a function no longer logs ``"undefined"``. (:issue:`94`)

- XML reporter now reports uncaught exceptions. (:issue:`134`)

- Dots reporter wraps lines when they become too long

- Uncaught exceptions does not print overlapping with dots

- Proper support for asynchronous test cases/specs (:issue:`15`)


v0.4.0 -- Buster.JS Beta 2
==========================

Released 2012-02-21.

This is a brief (i.e. not exhaustive) overview of changes from Beta 1. Beta 2
introduces quite a few fundamental refactorings and rewrites, and is
significantly closer to a stable 1.0 release than its predecessor.

With Beta 2, we've entered a more rapid iterative development and release
cycle. In the four days since the initial release, three patch updates have
already been shipped. "Beta 2" refers to Buster.JS version 0.4.1 or newer,
until we decide to do a release candidate (or another major beta, if
necessary).

Problems?
---------

Please `report as many issues <https://github.com/busterjs/buster/issues>`_ as
you can, and consider `contributing docs
<https://github.com/busterjs/buster-docs>`_ or file feature requests so we can
improve documentation. Docs are behind on some things, but we're working on it.

Breaking change: Config files can no longer read files outside of ``rootPath``
------------------------------------------------------------------------------

Since we haven't reached 1.0 stable yet, we're changing APIs without making
them backwards compatible.

Configuration file loading is revamped (most importantly,
:ref:`buster-resources` was completely rewritten).

``sources``, ``tests``, etc can no longer contain paths outside the root path.
The root path defaults to the path the configuration file is in. You can also
provide the ``rootPath`` property in the configuration file to base the project
outside the directory where the configuration file is located.

::

    config["My tests"] = {
        sources: ["../src/**/*.js"], // Will not work!
        tests: ["**/*-test.js"]
    };

    config["My tests"] = {
        rootPath: "../", // Will work (or just move the config file up one folder)
        sources: ["src/**/*.js"],
        tests: ["tests/**/*-test.js"]
    };


Changes
-------

- Stronger Node.JS inferences across the board.

- :ref:`Capture server <buster-capture-server>`: significant refactor.
  "Clients" are now "slaves" and several URLs have changed.

- Configuration file can now load :doc:`extensions <extensions/index>`.  A few
  are already availble, and others, like buster-amd (:issue:`15`) and coverage
  is right around the corner.

- buster-promise is now deprecated and will not receive further updates. We
  recommend the wonderful `when.js <https://github.com/cujojs/when>`_
  instead--it's what we use.

- Buster now syntax checks files before attempting to run tests in browsers.
  This ensures a stable environment with good feedback, regardless of target
  browser.

- The test runner was rewritten. It now supports per-test timeouts, the done
  callback can be used to wrap functions ("we're done when this function is
  called"), asynchronous ``testCase`` and ``describe``, and TeamCity reporter.

- The test runner now has a system for including other measures in a test run,
  issuing warnings, or even preventing tests from running at all. The first
  external tool included in this system is :ref:`buster-lint`. Expect more
  thorough documentation of this system as it evolves.


v0.3.0 -- Buster.JS Beta 1
==========================

The beta is upon us!

See :ref:`getting started <getting-started>` and :ref:`the overview <overview>`
for usage, installation, features, etc.

So far we have QUnit style static html page testing, JsTestDriver style browser
automation, and node testing. We have stubbing and mocking, setUp and tearDown,
asynchronous tests, hybrid browser/Node tests, and much more.

We *don't* have a super stable 1.0 that you can connect to a zillion old
browsers to and have it run in a stable fashion in your CI environment. Getting
there requires field testing, and that's where you come in.

You will run into issues, and when you do, we want to know about them. Please
don't hesitate `posting issues in the issue tracker
<https://github.com/busterjs/buster/issues>`_.

See also `mailing list <http://groups.google.com/group/busterjs>`_,
#buster.js at irc.freenode.net, and `@buster_js at Twitter
<http://twitter.com/buster_js>`_.


Known issues
------------

IE7 and lower, and Safari, doesn't work with ``buster server``. You can still
use ``buster static`` to run your tests in these browsers.


Roadmap
-------

- Running browser tests without a browser and a server via PhantomJS
- Stability for CI environments etc.
- ...and more. This list is incomplete.
