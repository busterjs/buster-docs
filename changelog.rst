.. highlight:: javascript

=========
Changelog
=========

Here you find details about what have changed with each release of Buster.JS.


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
