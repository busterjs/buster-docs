.. default-domain:: js
.. highlight:: javascript
.. _buster-test-runner:

===========
Test runner
===========

Version:
    See :ref:`buster-test`
Module:
    ``require("buster-test").testRunner;``
In browsers:
    ``buster.testRunner;``

Evented test runner for both synchronous and asynchronous tests. The runner
itself always executes asynchronously, making it very good at visualizing
ongoing progress and helps avoid long running script warnings in browsers.

::

    var testRunner = require("buster-test").testRunner;
    var xUnitConsoleReporter = require("buster-test").xUnitConsoleReporter;

    var runner = testRunner.create();
    var reporter = xUnitConsoleReporter.create({ color: true });
    reporter.listen(runner);

    runner.runSuite([context, context2, ...]);


.. _test-runner-events:

Events
======


.. _event-suite-start:

``suite:start`` event
---------------------

Signature::

    "suite:start", function () {}

Emitted once, as the runner starts running a test suite (typically when
:func:`testRunner.runSuite` is called).


.. _event-suite-end:

``suite:end`` event
-------------------

Signature::

    "suite:end", function (results) {}

Emitted once, when all contexts are run (typically when
:func:`testRunner.runSuite`  completes).


``context:start`` event
-----------------------

Signature::

    "context:start", function (context) {}

Emitted every time a :ref:`test-context-object` is entered.


``context:end`` event
---------------------

Signature::

    "context:end", function (context) {}

Emitted every time a :ref:`test-context-object` is completed.


.. _event-context-unsupported:

``context:unsupported`` event
-----------------------------

Signature::

    "context:unsupported", function (unsupported) {}

Emitted every time a context fails its requirements (when that happens, neither
``context:start`` or ``context:end`` are emitted).


``test:setUp`` event
--------------------

Signature::

    "test:setUp", function (context) {}

Emitted once per test before the setup method(s) for a test is called.


``test:start`` event
--------------------

Signature::

    "test:start", function (context) {}

Emitted after running the test's setup(s), but before the test itself runs.


``test:async`` event
--------------------

Signature::

    "test:async", function (test) {}

Emitted when a test has been found to be asynchronous (usually means
that the test function was called and has returned).


``test:tearDown`` event
-----------------------

Signature::

    "test:tearDown", function (test) {}

Emitted once per test before the tear down method(s) for a test is called.


.. _event-test-failure:

``test:failure`` event
----------------------

Signature::

    "test:failure", function (error) {}

Emitted when the test throws (or otherwise flags) an :class:`AssertionFailure`.
Only emitted once per test.


.. _event-test-error:

``test:error`` event
--------------------

Signature::

    "test:error", function (error) {}

Emitted when the test throws any error that is not an
:class:`AssertionFailure`.  Only emitted once per test.


``test:success`` event
----------------------

Signature::

    "test:success", function (test) {}

Emitted if the test passes.


.. _event-test-timeout:

``test:timeout`` event
----------------------

Signature::

    "test:timeout", function (test) {}

Emitted if the test runner forcefully aborts the test. This happens when the
test is asynchronous and does not resolve within the timeout configured by
:attr:`testRunnerOptions.timeout`.


``test:deferred`` event
-----------------------

Signature::

    "test:deferred", function (test) {}

Emitted when a test is marked as deferred. The test is not run.


.. _event-uncaught-exception:

``uncaughtException`` event
---------------------------

Signature::

    "uncaughtException", function (exception) {}

Uncaught errors are errors that the test runner is unable to associate with the
test that threw it. They occur in two situations:

- A synchronous test spawns an asynchronous task that results in an error. For
  instance, calling :func:`setTimeout` with a callback that throws an error in
  a synchronous test.

- An aborted asynchronous test throws (for instance, by failing an assertion).

The ``"uncaughtException"`` event will only be emitted when the environment
supports it and the :attr:`handleUncaughtExceptions` property is set to
``true``. Browsers that do not support `window.onerror
<https://developer.mozilla.org/en/DOM/window.onerror>`_ are unable to support
this feature.


Methods
=======

.. function:: testRunner.create

    ::

        var runner = buster.testRunner.create([opts]);

    Creates a new test runner instance.


.. function:: testRunner.onCreate

    ::

        buster.testRunner.onCreate(function (runner) {});

    Register a callback which is called everytime a runner is created with
    :func:`testRunner.create`.


.. function:: testRunner.runSuite

    ::

        runner.runSuite([context, context2, ...]);

    Run an array of :ref:`test-context-object` as a test suite.


.. function:: testRunner.run

    ::

        runner.run(context);

    Run a single :ref:`test-context-object`. Note that this method does not
    trigger the :ref:`event-suite-start`, and using it instead of
    :func:`testRunner.runSuite` may cause unintended behavior in
    :ref:`buster-test-reporters`.


.. function:: testRunner.assertionCount

    ::

        var count = runner.assertionCount();

    The default implementation of this method is a no-op function. This method
    is called by the runner after each test to determine the number of
    assertions used in the test. It should not accumulate the assertion count.

    Because the runner itself has no knowledge of the assertion library, this
    method is intended to be overridden by the assertion library in use. For
    instance, this is the integration necessary to count assertions with
    :ref:`buster-assertions`::

        var assertions = 0;

        buster.assert.on("pass", function () {
            assertions += 1;
        });

        buster.testRunner.onCreate(function (runner) {
            runner.on("test:start", function () {
                assertions = 0;
            });
        });

        buster.testRunner.assertionCount = function () {
            return assertions;
        };


.. function:: testRunner.assertionFailure

    ::

        runner.assertionFailure(exception);

    Can be called from assertion libraries that do not throw an exception on
    assertion failure. For assertion failures to be picked up no matter what in
    asynchronous tests, this method needs to be called, as some exceptions are
    not possible for the runner to catch.


Properties
==========

Test runner properties can be set when creating an instance, or simply by
assigning to the property on an existing runner::

    var runner = buster.testRunner.create({
        timeout: 500
    });

    // Or:

    var runner = buster.testRunner.create();
    runner.timeout = 500;


.. attribute:: testRunnerOptions.failOnNoAssertions:

    Default: ``true``

    When ``true``, a test with no assertions is considered a failure. The
    number of assertions are measured with :func:`testRunner.assertionCount`.


.. attribute:: testRunnerOptions.timeout

    Default: ``250``

    When an asynchronous test runs for more than :attr:`timeout
    <testRunnerOptions.timeout>` ms, the runner will abort it and emit a
    :ref:`test:timeout <event-test-timeout>` event.


.. attribute:: testRunnerOptions.handleUncaughtExceptions

    Default: ``true``

    When ``true``, the runner will attempt to handle uncaught exceptions, by
    registering a listener on ``process`` for `"uncaughtException"
    <http://nodejs.org/docs/v0.4.0/api/process.html#event_uncaughtException_>`_
    (Node.js) and assigning a callback to `window.onerror
    <https://developer.mozilla.org/en/DOM/window.onerror>`_ (browsers).


Supporting objects
==================


``context`` object
------------------

See :ref:`test-context-object`.


``test`` object
---------------

See :ref:`test-object`.


``results`` object
------------------

A high-level numeric report. Emitted with :ref:`event-suite-end`::

    {
        contexts: 0,
        tests: 0,
        errors: 0,
        failures: 0,
        assertions: 0,
        timeouts: 0,
        deferred: 0
    }


``error`` object
----------------

An object representing a test failure (or error), emitted with
:ref:`event-test-failure` and :ref:`event-test-error`::

    {
        name: "Name of test",
        error: {
            name: "Type of exception",
            message: "Exception message",
            stack: "Stack trace as string"
        }
    }


``exception`` object
--------------------

An exception-like object, emitted with :ref:`event-uncaught-exception`.  In
browsers, this object does not have a stack trace::

    {
        name: "Type of exception",
        message: "Exception message",
        stack: "Stack trace as string"
    }


``unsupported`` object
----------------------

Information about an unsupported context. Emitted with
:ref:`event-context-unsupported`. Contains an array of names of failed
requirements and a context object::

    {
        context: context,
        unsupported: ["label1", "label2"]
    }
