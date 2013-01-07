.. default-domain:: js
.. highlight:: javascript
.. _buster-test-context:

=============
Test contexts
=============

Version:
    See :ref:`buster-test`

A test context is Buster's internal test case/specification data format.
Specifically, a test context is the kind of object that the :ref:`test runner
<buster-test-runner>` knows how to run. This document describes the data format
in detail - what features it and the runner supports as well as how to create
test contexts from external front-ends.

The idea behind test contexts is to separate the syntax you use to write a test
case/specification (*the front-end*) from the tools that run and visualize
results of these tests. Test contexts have enabled Buster to ship with two
rather different ways of writing tests for the same runner;
:ref:`buster.testCase <buster-test-case>` and :ref:`buster.spec
<buster-test-spec>`. They also enable us to provide adapters for other test
frameworks, such as in :ref:`buster-jstestdriver`.

If you are looking to run tests written for another testing library with
Buster, you have come to the right place. Supporting other test frameworks
front-ends is a simple matter of converting the objects/functions created by
the library to a :ref:`test-context-object`. For inspiration, see the
implementation of the aforementioned :ref:`buster.testCase <buster-test-case>`,
:ref:`buster.spec <buster-test-spec>` and ref:`buster-jstestdriver`.

.. note::
    Test contexts are not intended to be hand-written, rather they represent
    the data test specification DSLs should produce in order to use the Buster
    test runner.


.. _test-context-object:

``testContext`` object
======================

Represents a test case (xUnit terminology) or a specification (BDD
terminology). Contains a set of tests to run, optional setup and teardown
methods as well as optional nested contexts. Refer to :ref:`the example
<test-context-example>` for more information on how this can be used in
practice.

Setup and teardown methods can be asynchronous, see :ref:`the section on
asynchronous tests <test-context-async>`.


.. attribute:: testContext.name

    The test context name/description as a string


.. attribute:: testContext.setUp

    **Optional**. A function that will run before each test. If using nested
    contexts, the setup function will also be executed before each test (and
    their local setup, if any) in nested contexts.


.. attribute:: testContext.tearDown

    **Optional**. A function that will run after each test. If using nested
    contexts, the teardown function will also be executed after each test (and
    their local teardown, if any) in nested contexts.


.. attribute:: testContext.tests

    An array of :ref:`test-object`.


.. attribute:: testContext.contexts

    An array of :ref:`test-context-object`. In other words, the test context
    data format (and thus, the :ref:`buster-test-runner`) supports arbitrarily
    nested contexts.

.. attribute:: testContext.parent

    The parent :ref:`test-context-object`, if any.


.. attribute:: testContext.testCase

    **Optional**.  Prototype object used for ``this`` when running tests. This
    object may define helper methods and properties to use in tests. The test
    runner creates a new instance from this object with :func:`buster.create`
    for each test. The created object is shared as ``this`` in all setup and
    teardown methods as well as in the test. If this object is not provided, an
    "empty" object is created and used as ``this`` when running tests.


.. _test-object:

``test`` object
===============

Represents a test function.


.. attribute:: test.name

    The test function name, as a string.


.. attribute:: test.func

    The test function. See :ref:`the section on asynchronous tests
    <test-context-async>` for how to mark it as - well, asynchronous.


.. attribute:: test.context

    **Optional**. The context to which the test belongs.


.. attribute:: test.deferred

    **Optional**. If this property is set to ``true``, the test will not be
    run, but the test runner will emit an event for it, allowing reporters to
    communicate tests that should eventually run (and hopefully pass).


.. _test-context-async:

Asynchronous tests
==================

There is no flag to mark tests as asynchronous even though the
:ref:`buster-test-runner` supports both synchronous and asynchronous tests. The
reason is that it cannot be determined up-front if a test is asynchronous or
not.

To create asynchronous tests (i.e. ones that the runner will wait for), the
test function can either explicitly accept a single argument, which is a
function, **or** return a :ref:`thenable promise <returning-a-promise>`.

The argument passed to the test is a function. When the function is called, the
asynchronous test is deemed done. The idiomatic way of creating asynchronous
tests using this arguments looks like the following::

    function someAsyncTestFunction(done) {
        setTimeout(function () {
            buster.assert(true);
            done();
        }, 100);
    }

This assumes that the assertion framework can fail without throwing an error
(as an error would be intercepted as uncaught in the above example, if
intercepted at all). If this is not the case, you can make your assertions in a
callback to the ``done`` function::

    function someAsyncTestFunction(done) {
        setTimeout(function () {
            done(function () {
                buster.assert(true);
            });
        }, 100);
    }

Tests can also be made asynchronous by way of returning a promise. The test
runner considers any object with a ``then`` method a promise::

    function someAsyncTestFunction() {
        var promise = {
            then: function (callback) {
                this.callbacks = this.callbacks || [];
                this.callbacks.push(callback);
            }
        };

        setTimeout(function () {
            buster.assert(true);
            var callbacks = promise.callbacks || [];

            for (var i = 0, l = callbacks.length; i < l; ++i) {
                callbacks[i]();
            }
        }, 100);

        return promise;
    }

Note that this does not work entirely as expected unless your assertion
framework of choice is able to notify the runner of failure without throwing an
exception. If the assertion fails (and throws an exception), the promise will
never be resolved, thus the runner will fail the test with a timeout, **not**
an assertion error.

The above example is very verbose, simply to illustrate the duck-typed nature
of promises. You can do better by using e.g. `when.js
<https://github.com/cujojs/when>`_::

    function someAsyncTestFunction() {
        var deferred = when.defer();

        setTimeout(function () {
            buster.assert(true);
            deferred.resolver.resolve();
        }, 100);

        return deferred.promise;
    }

Setup and teardown functions can use the same mechanism to be asynchronous.


.. _test-context-example:

Example
=======

Say you have a test case like the following (warning: fictional front-end, this
is just to explain what goes where in the generated context)::

    testCase("Circle tests", {
        createCircle: function (radius) {
            return {
                diameter: function () {
                    return radius * 2;
                }
            };
        },

        "diameter should equal twice the radius": function () {
            var circle = this.createCircle(6);

            buster.assert.equals(circle.diameter(), 12);
        }
    });

The test case has a single test and a helper method defined on the same object
(thus accessed through ``this`` in the test). This simple test case can be
represented as a Buster runnable context the following way::

    var simpleContext = {
        name: "Circle tests",

        testCase: {
            createCircle: function (radius) {
                return {
                    diameter: function () {
                        return radius * 2;
                    }
                };
            }
        },

        tests: [{
            name: "diameter should equal twice the radius",
            func: function () {
                var circle = this.createCircle(6);

                buster.assert.equals(circle.diameter(), 12);
            }
        }]
    };

The following example is reproduced from the `official QUnit docs
<http://docs.jquery.com/Qunit>`_ and shows a fairly typical QUnit test::

    test("a basic test example", function () {
        ok(true, "this test is fine");
        var value = "hello";
        equals("hello", value, "We expect value to be hello");
    });

    module("Module A");

    test("first test within module", function () {
        ok(true, "all pass");
    });

    test("second test within module", function () {
        ok(true, "all pass");
    });

    module("Module B");

    test("some other test", function() {
        expect(2);
        equals(true, false, "failing test");
        equals(true, true, "passing test");
    });

The corresponding test context would look like::

    var qunitContext = {
        name: "" // Top level module was nameless

        tests: [{
            name: "a basic test example",
            func: function () {
                ok(true, "this test is fine");
                var value = "hello";
                equals("hello", value, "We expect value to be hello");
            }
        }],

        contexts: [{
            name: "Module A",

            tests: [{
                name: "first test within module",
                func: function () {
                    ok(true, "all pass");
                }
            }, {
                name: "second test within module",
                func: function () {
                    ok(true, "all pass");
                }
            }]
        }, {
            name: "Module B",

            tests: [{
                name: "some other test",
                func: function() {
                    expect(2);
                    equals(true, false, "failing test");
                    equals(true, true, "passing test");
                }
            }]
        }]
    };
