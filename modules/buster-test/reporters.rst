.. default-domain:: js
.. highlight:: javascript
.. _buster-test-reporters:

==============
Test reporters
==============

Version:
    See :ref:`buster-test`
Module:
    ``require("buster-test").reporters;``
In browsers:
    ``buster.reporters;``

Reporters listen to :ref:`test runner <buster-test-runner>` events and visualize
progress and results of test runs. Buster ships with several alternatives, and
it is easy to :ref:`make your own <implement-reporter>`.


``dots`` reporter
=================

Prints a single character for each test as the tests are running. When the test
run completes, it prints a list of errors and a summary. The characters printed
while running are:

``.``:
    Test passed (green)

``F``:
    Test failed (red)

``E``:
    Uncaught error (yellow)

``A``:
    Asynchronous test (purple)

``T``:
    Timeout (red)

The ``A`` indicating an asynchronous test is replaced by one of the others when
the test completes, or a ``T`` if it times out (using `ANSI escape characters
<http://en.wikipedia.org/wiki/ANSI_escape_code>`_).

In order to help you find the source of errors faster, the reporter filters the
stack trace using :ref:`buster.stackFilter <stack-filter>`.


.. function:: dotsReporter.create

    ::

        var reporter = dotsReporter.create(options)l

    Create an instance. For options, see :ref:`reporter-console-options`.


.. function:: dotsReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a :ref:`test runner <buster-test-runner>`.


Example::

    var testRunner = require("buster-test").testRunner;
    var dotsReporter = require("buster-test").reporters.dots;

    var reporter = dotsReporter.create({ color: false });
    var runner = testRunner.create();
    reporter.listen(runner);

    runner.runSuite(...);


Sample output
-------------

.. image:: /_static/buster-test/dots-console-reporter.png
    :width: 661
    :height: 698


``specification`` reporter
==========================

Reporter inspired by those found in `vows.js <http://vowsjs.org/>`_, `nodeunit
<https://github.com/caolan/nodeunit>`_, and others. The reporter gives you all
information it has as soon as it can. With longer-running test cases, this
reporter will give you the meat of your errors faster.

In order to help you find the source of errors faster, the reporter filters
the stack trace using :ref:`buster.stackFilter <stack-filter>`.


.. function:: specificationReporter.create

    ::

        var reporter = specificationReporter.create(options);

    Create an instance. For options, see :ref:`reporter-console-options`.


.. function:: specificationReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a test runner.


Example::

    var testRunner = require("buster-test").testRunner;
    var specificationReporter = require("buster-test").reporters.specification;

    var reporter = specificationReporter.create({ color: false });
    var runner = testRunner.create();
    reporter.listen(runner);

    runner.runSuite(...);


Sample output
-------------

.. image:: /_static/buster-test/specification-console-reporter.png
    :width: 685
    :height: 681


``quiet`` reporter
==================

The quiet reporter simply prints the ending stats only.


.. function:: quietReporter.create

    ::

        var reporter = quietReporter.create(options);

    Create an instance. For options, see :ref:`reporter-console-options`.


.. function:: quietReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a test runner.


Example::

    var testRunner = require("buster-test").testRunner;
    var quietReporter = require("buster-test").reporters.quiet;

    var reporter = quietReporter.create({ color: false });
    var runner = testRunner.create();
    reporter.listen(runner);

    runner.runSuite(...);


Sample output
-------------

.. image:: /_static/buster-test/quiet-console-reporter.png
    :width: 661
    :height: 34


``xml`` reporter
================

Generates JUnit/Ant compatible XML output for use in continuous integration
servers. The reporter prints XML to stdout, so you have to pipe it to a file
manually if needed. The XML output is compatible with CI servers such as
`Jenkins <http://jenkins-ci.org/>`_ (formerly Hudson).

.. function:: xmlReporter.create

    ::

        var reporter = xmlReporter.create(options);

    Create an instance. For options, see :ref:`reporter-console-options`.


.. function:: xmlReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a test runner.


Example::

    var testRunner = require("buster-test").testRunner;
    var xmlReporter = require("buster-test").reporters.xml;

    var reporter = xmlReporter.create({ color: false });
    var runner = testRunner.create();
    reporter.listen(runner);

    runner.runSuite(...);


Sample output
-------------

.. image:: /_static/buster-test/xml-reporter.png
    :width: 780
    :height: 837


``html`` reporter
=================

The reporter mimics the ``specification`` reporter. It can use an entire web
page to render a nice test report, or embed itself as a console, making it
useful for in-app integration testing. You can also use it on the command line
to generate an HTML report of your test run.

In order to help you find the source of errors faster, the reporter filters
the stack trace using :ref:`buster.stackFilter <stack-filter>`.


.. function:: htmlReporter.create

    ::

        var reporter = htmlReporter.create(htmlOptions);

    Create an instance. For options, see :ref:`reporter-html-options`.


.. function:: htmlReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a test runner.


Example::

    var reporter = buster.reporters.html.create({
        root: document.body // Full webpage mode
    });

    var runner = buster.testRunner.create();
    reporter.listen(runner);

    runner.runSuite(...);


Sample output
-------------

.. image:: /_static/buster-test/html-reporter.png
    :width: 604
    :height: 810


``jsonProxy`` reporter
======================

Not intended for human consumption. The jsonProxy reporter proxies all events
from the :ref:`buster-test-runner`, but strips any non-JSON safe value (such as
functions). Buster uses this when emitting test results from a browser to the
server.


.. function:: jsonProxyReporter.create

    ::

        var reporter = jsonProxyReporter.create(emitter);

    Create an instance. You can optionally provide an event emitter to emit
    events with. Buster uses this option to provide a messaging client that
    will emit events directly over the wire.


.. function:: jsonProxyReporter.listen

    ::

        reporter.listen(testRunner);

    Bind the reporter to a test runner.


The jsonProxy reporter is to be used in place of the test runner when using a
reporter that needs pure JSON-friendly objects. The example below uses the XML
reporter - it works fine directly with the test runner as well, it is only used
to illustrate how jsonProxy works::

    var proxy = buster.reporters.jsonProxy.create();
    var runner = buster.testRunner.create();
    proxy.listen(runner);

    var reporter = buster.reporters.xml.create();
    reporter.listen(proxy);


.. _implement-reporter:

Implementing a reporter
=======================

Buster reporters consume events from a :ref:`buster.testRunner
<buster-test-runner>` instance and should conform to the simple API described
below. For the reporter to be usable with Buster's auto-wiring mechanism, you
also need to make the reporter available as a Node module. The auto-wiring
mechanism is what is in use when you have not instantiated a runner on your own
and you do this:

.. code-block:: sh

    BUSTER_REPORTER=myReporter node mytest.js

(Or use ``buster test -r myReporter``)


#. Include the reporter in ``buster.reporters``

   In browsers, you must expose the reporter in the correct object::

       buster.reporters.myReporter = { /*...*/ };

#. Implement ``create(options)``

   This method should return a new instance. It will be passed an ``options``
   object.

#. Implement ``listen(testRunner)``

   This method allows you to listen to events of interest on the test runner.
   The built-in reporters typically use :func:`buster.bind`, but you are
   completely free to implement this the way you feel best. See
   :ref:`test-runner-events` for available events.

#. Include your reporter on the load path

   In browsers, this means add a script tag loading your reporter *after*
   loading Buster and *before* loading your tests. On node, you must make the
   reporter available to Buster. This is usually accomplished by coding the
   reporter as a Node module and doing ``npm link`` in the reporter project.

#. Run it:

   .. code-block:: sh

       BUSTER_REPORTER=myReporter node mytest.js


Example
-------

The following example shows how to implement a reporter that prints test
contexts and test names as a nested tree.

#. Create a directory for our reporter:

   .. code-block:: sh

       mkdir /tmp/spec-tree
       cd /tmp/spec-tree

#. First, let's just create a blank reporter and a sample project to test it
   with. We'll have the reporter print something so we can verify that it
   works.

   ::

       // /tmp/spec-tree/index.js
       module.exports = {
           create: function (options) {
               return Object.create(this);
           },

           listen: function (runner) {
               runner.on("test:start", function (test) {
                   console.log("Test started");
               });
           }
       };


.. _reporter-console-options:

Console reporter options
========================

Options when creating console reporters. All properties are optional.

``color``:
    When ``true``, print report in colors. Default is ``true``.

``bright``:
    When ``true``, print report in bright colors (requires ``color: true``).
    Default is ``true``.

``cwd``:
    The current working directory. Passed to :ref:``buster.stackFilter``
    <stack-filter>`.

``io``:
    The stream to print to. The default value is to use the ``sys`` module. The
    ``io`` object is required to implement two methods: ``print``, which prints
    a string and ``puts``, which prints a string and a line-break.

Default values
--------------

::

    {
        color: true,
        bright: true,
        cwd: null,
        io: require("sys")
    }


.. _reporter-html-options:

HTML reporter options
=====================

Options when creating HTML reporters.

``root``:
      The root element to render test results in. Required.
