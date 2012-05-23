.. highlight:: javascript

=========
Changelog
=========


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

- Configuration file can now load :doc:`extensions`.  A few are already
  availble, and others, like `buster-amd
  <https://github.com/busterjs/buster/issues/15>`_ and coverage is right around
  the corner.

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
