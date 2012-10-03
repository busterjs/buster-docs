.. default-domain:: js
.. highlight:: javascript
.. _stack-filter:

============
Stack filter
============

Version:
    See :ref:`buster-test`
Module:
    ``require("buster-test").stackFilter;``
In browsers:
    ``buster.stackFilter;``

Stack traces contain some interesting information and (often) lots of noise.
The stack filter helps reduce the noise to help you find errors faster. It can
do so by:

#. stripping the current working directory from paths, and
#. removing lines from inside buster (or other libraries not of your interest).


Methods
=======

.. function:: buster.stackFilter

    ::

        var lines = buster.stackFilter(stack[, cwd]);

    Trims a stack trace by removing lines that match
    :attr:`buster.stackFilter.filters`. ``stack`` is a string containing the
    entire stack trace. The optional ``cwd`` argument is a string containing
    the current working directory. When provided, it is stripped from all lines
    in the resulting stack trace.

    The function returns an array of stack trace lines. Given the following
    stack trace::

        var stack = 'AssertionError: [assert.equals] Expected "Something" to be equal to "Other"' +
          'at Function.fail (/home/christian/buster/node_modules/buster-assert/lib/buster-assert.js:147:25)' +
          'at fail (/home/christian/buster/node_modules/buster-assert/lib/buster-assert.js:61:16)' +
          'at Function.equals (/home/christian/buster/node_modules/buster-assert/lib/buster-assert.js:237:13)' +
          'at Object.<anonymous> (/home/christian/buster/doc/samples/test-case.js:101:23)' +
          'at asyncFunction (/home/christian/buster/node_modules/buster-test/lib/buster-test/runner.js:79:21)' +
          'at Object.runTestFunction (/home/christian/buster/node_modules/buster-test/lib/buster-test/runner.js:312:26)' +
          'at /home/christian/buster/node_modules/buster-core/lib/buster-core.js:45:31' +
          'at EventEmitter._tickCallback (node.js:108:26)';

    :func:`buster.stackFilter` would reduce it like so::

        var lines = buster.stackFilter(stack, "/home/christian/buster");

        // lines:
        // ['AssertionError: [assert.equals] Expected "Something" to be equal to "Other"',
        //  'at Object.<anonymous> (doc/samples/test-case.js:101:23)',
        //  'at runOne (node_modules/buster-promise/lib/buster-promise.js:89:35',
        //  'at Array.0 (node_modules/buster-promise/lib/buster-promise.js:75:47']


.. function:: buster.stackFilter.match

    ::

        var isMatch = buster.stackFilter.match(line);

    Helper function used by :func:`buster.stackFilter`. Returns ``true`` if
    ``line`` matches any of ``stackFilter.filters``.


Properties
==========


.. attribute:: buster.stackFilter.filters

    The :attr:`buster.stackFilter.filters` property is an array of strings to
    match against lines in a stack trace. Any stack trace line that match one
    of these filters will be stripped. The default value is an array of core
    buster modules. If you are developing add-ons to Buster, and don't want
    long traces from inside these libraries in test reports, add entries to
    this array.

    The :ref:`buster-sinon` module adds the core `Sinon.JS
    <http://sinonjs.org>`_ libraries to the array to avoid them getting in the
    way of finding where in your test and implementation a failure originated.
    (Note that the added entry filters out lines from both Sinon.JS and the
    buster-sinon adapter.)

    ::

        buster.stackFilter.filters.push("lib/sinon");

    If you want the full traces, you can simply wipe the ``filters`` array in
    your tests::

        delete buster.stackFilter.filters;
