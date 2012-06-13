===============
Windows support
===============

Currently, Buster does not work fully on Windows. This page contains known
issues, the status of various modules, and a todo list. If you're a Windows
developer that would like to use Buster, your help is very much appreciated.


Running tests on Windows
========================

To fix most of these problems, you will need to run buster's tests. Because of
some these problems, you cannot use the ``buster test`` CLI tool at this point.
Instead, simply run individual test files with the ``node`` binary, i.e.,
``node test/posix-argv-parser-test.js``.


Known issues
============

- Binary dependencies
- Failing tests (on Windows) in certain modules
- Wide-spread use of string concatenation for paths, rather than the
  appropriate (and platform-independent) ``path.join()``


Binary dependencies
-------------------

Buster depends on a few modules that have binary extension dependencies. These
do not build on Windows (and never will), thus we need to find a way around
them. To my knowledge there are two main problems: Faye 0.7 (which depends on
redis, which needs to be compiled) and jsdom, which depends on Contextify.
Contextify is possible to set up for Windows with pre-built binaries, but not
with npm.

The Faye issue is being solved in August's `rewrite of buster-capture-server
<https://github.com/busterjs/buster-capture-server/tree/0.5.0>`_, which depends
on Faye 0.8, which does not have the redis dependency.

The jsdom issue is still unsolved. jsdom is an optional dependency for Buster,
so we really should be able to install on Windows even if we can't get jsdom.
Help is appreciated.


Failing tests
-------------

Some modules have failing tests on Windows. You can help by :doc:`setting up
the development environment <environment>`, and run the tests for either of
these projects, and fix the failing ones.

In many cases, tests fail because of inappropriate string concatenation when
dealing with paths (see the next section).

- :repo:`buster-bayeux-emitter`: Tests depend on Faye, so will not run.
- :repo:`buster-capture-server`: August is on the case
- :repo:`buster-cli`: 3 errors, hangs
- :repo:`buster-client`: Multiple failures and timeouts, possibly path related
- :repo:`buster-configuration`: Multiple failures and timeouts, possibly path related
- :repo:`buster-glob`: All tests passes, but should be checked for potential
  path concatenation issues
- :repo:`buster-jstestdriver`: 1 failing test
- :repo:`buster-resources`: Multiple failures and timeouts, possibly path related
- :repo:`buster-static`: Multiple failures and timeouts, unknown why
- :repo:`buster-stdio-logger`: 1 failing test
- :repo:`buster-syntax`: A few failing tests, due to missing jsdom dependency.
  Actually OK
- :repo:`buster-test-cli`: Some failing tests, possibly path related
- :repo:`posix-argv-parser`: 1 failing test, also fails on Linux...


Inappropriate path concatenation
--------------------------------

Buster uses string concatenation to build paths in many places. This causes
paths with forward slashes on Windows, which does not work. To find and fix
these, running the tests should mostly help. If you find somewhere that uses
string concatenation where ``path.join()`` should have been used and this is
not caught by the tests, please help by adding tests and fixing the problem.
