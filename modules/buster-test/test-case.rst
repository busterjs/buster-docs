.. default-domain:: js
.. highlight:: javascript
.. _buster-test-case:

=========
Test case
=========

Version:
    See :ref:`buster-test`
Module:
    ``require("buster-test").testCase;``
In browsers:
    ``buster.testCase;``

`xUnit <http://en.wikipedia.org/wiki/XUnit>`_ test case sprinkled with some BDD
idioms. ``buster.testCase`` supports setup and teardown, asynchronous tests,
nested test cases, deferred tests, and more.

``buster.testCase`` produces :ref:`test context objects <test-context-object>`
that can be run using the :ref:`buster-test-runner`.


testCase
========

.. function:: buster.testCase.testCase(name, tests)

    ``name`` is an arbitrary string. The ``tests`` object can contain test
    functions, nested test cases, setup and teardown.


Example: Bowling kata
---------------------

The following example shows some tests from `the bowling kata
<http://butunclebob.com/ArticleS.UncleBob.TheBowlingGameKata>`_, using a setup
method::

    var testCase = buster.testCase("Bowling kata tests", {
        setUp: function () {
            this.game = new BowlingGame();

            this.rollMany = function (rolls, pins) {
                for (var i = 0; i < rolls; ++i) {
                    this.game.roll(pins);
                }
            };
        },

        "gutter game yields 0 in score": function () {
            this.rollMany(20, 0);

            buster.assert.equals(0, this.game.score());
        },

        "1 pin on each roll should yield score of 20": function () {
            this.rollMany(20, 1);

            buster.assert.equals(20, this.game.score());
        }
    });


Example: controller tests
-------------------------

The following (slightly more involved) example shows some tests from a todo
application's form controller. Nested contexts are used to separate both
controller actions as well as successful and failed attempts at posting the
form. Note the use of nested setup methods -- both setups will be run (the outer
first, then the inner) for each test in the "adding items" test case).

::

    var testCase = buster.testCase("Form controller", {
        setUp: function () {
            this.form = document.createElement("form");
            this.form.innerHTML = "<fieldset>" +
                "<input type='text' name='item' id='item'>" +
                "</fieldset>";

            this.input = this.form.getElementsByTagName("input")[0];
            this.backend = { add: sinon.spy() };
            this.controller = todoList.formController.create(this.form, this.backend);
            this.callback = sinon.spy();
            this.controller.on('item', this.callback);
        },

        "adding items": {
            setUp: function () {
                this.input.value = "It puts the lotion in the basket";
            },

            "successfully": {
                "should emit onItem on success": function () {
                    var item = { text: "It puts the lotion in the basket" };
                    sinon.stub(this.backend, "add").yields(item);

                    this.controller.addItem();

                    sinon.assert.calledOnce(this.callback);
                    sinon.assert.calledWith(this.callback, item);
                },

                "should clear form on success": function () {
                    this.input.value = "It puts the lotion in the basket";
                    this.backend.add = sinon.stub().yields({});

                    this.controller.addItem();

                    buster.assert.equals("", this.input.value);
                }
            },

            "unsuccessfully": {
                "should render error on failure": function () {
                    sinon.stub(this.backend, "add").yields(null);

                    this.controller.addItem();
                    var err = this.form.firstChild;

                    buster.assert.match(err, {
                        tagName: "p",
                        className: "error",
                        innerHTML: "An error prevented the item from being saved"
                    });
                }
            }
        }
    });


Nested test cases
-----------------

Test cases can be arbitrarily nested. Simply add a property whose value is an
object with optional setup and teardown, tests and even more test cases. See
the explanation of :ref:`nested-setup-and-teardown` for an example of using
nested test cases.



.. _async-tests:

Asynchronous tests
==================

To create asynchronous tests (i.e. ones that the runner will wait for), the
test function can either explicitly accept a single argument, which is a
function, **or** return a thenable promise.


Explicitly accepting an argument
--------------------------------

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
        setTimeout(done(function () {
            buster.assert(true);
        }), 100);
    }


Returning a promise
-------------------

Tests can be made asynchronous by way of returning a promise. The test runner
considers any object with a ``then`` method a promise::

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


Setup and teardown
==================

Test cases can have setup and teardown functions. Setup functions are called
before every test, and is a suitable place to put shared setup code::

    var testCase = buster.testCase("Test with setup", {
        setUp: function () {
            this.object = { id: 42 };
        },

        "should override id": function () {
            this.object.id = 43;
            buster.assert.equals(this.object.id, 43);
        },

        "id should not equal 43": function () {
            // The object is recreated in setUp for each test
            buster.assert.notEquals(this.object.id, 43);
        }
    });

Similarly, teardown functions can be used to clean up after each test. Keep in
mind though, that the test's ``this`` object is discarded and recreated for
each test. If your unit tests are properly isolated you rarely need clean up.

::

    var testCase = buster.testCase("Test with teardown", {
        tearDown: function () {
            if (jQuery.ajax.restore) {
                jQuery.ajax.restore();
            }
        },

        "should make http request": function () {
            twitter.timeline("cjno", function () {});

            buster.assert(jQuery.ajax.calledOnce);
        }
    });


.. _nested-setup-and-teardown:

Nested setup and teardown
-------------------------

When nesting test cases, you can add setup and teardown methods to some or all
of your test cases. All applicable setup and teardown methods are called before
each test function. Setups are called starting from the outermost test case,
while tear downs are called starting from the test's local context. Let's
illustrate by way of an example::

    var testCase = buster.testCase("Nested setup and teardown call order", {
        setUp: function () {
            console.log("Setup #1");
        },

        tearDown: function () {
            console.log("Teardown #1");
        },

        "test #1": function () {
            console.log("Test #1");
        },

        "context": {
            setUp: function () {
                console.log("Setup #2");
            },

            "test #2": function () {
                console.log("Test #2");
            },

            "context": {
                setUp: function () {
                    console.log("Setup #3");
                },

                tearDown: function () {
                    console.log("Teardown #3");
                },

                "test #3": function () {
                    console.log("Test #3");
                }
            }
        }
    });

Will print:

.. code-block:: text

    Setup #1
    Test #1
    Teardown #1
    Setup #1
    Setup #2
    Test #2
    Teardown #1
    Setup #1
    Setup #2
    Setup #3
    Test #3
    Teardown #3
    Teardown #1


Asynchronous setup and teardown
-------------------------------

Setup and teardown methods are treated as asynchronous by the test runner if
they either return a thenable promise or if they explicitly accept an
argument. See :ref:`async-tests`.


Deferred tests
==============

If you have written a test that for some reason is impossible to pass in the
near future, you may grow tired of seeing it fail while working on other parts
of the system. Because the test may represent an important goal/requirement
(perhaps the goal of a longer refactoring session) it is undesirable to delete
it. Simply commenting out the test may cause you to forget it and commit
commented out code, which isn't very nice.

Buster recognizes the valid use of deferred tests and provides a simple way to
defer a test -- simply "comment out" its name, i.e., prefix the name with a
pair of ``//``::

    var testCase = buster.testCase("Bowling kata tests", {
        setUp: function () {
            this.game = new BowlingGame();

            this.rollMany = function (rolls, pins) {
                for (var i = 0; i < rolls; ++i) {
                    this.game.roll(pins);
                }
            };
        },

        "gutter game yields 0 in score": function () {
            this.rollMany(20, 0);

            buster.assert.equals(0, this.game.score());
        },

        "// 1 pin on each roll should yield score of 20": function () {
            this.rollMany(20, 1);

            buster.assert.equals(20, this.game.score());
        }
    });

In this example, the second test will not run, but **the reporter will include
it** and explicitly mark it as deferred, helping you avoid forgetting about it.
