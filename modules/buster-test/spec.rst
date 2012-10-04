.. default-domain:: js
.. highlight:: javascript
.. _buster-test-spec:

=========
Test spec
=========

Version:
    See :ref:`buster-test`
Module:
    ``require("buster-test").spec;``
In browsers:
    ``buster.spec;``

`BDD <http://en.wikipedia.org/wiki/Behavior_Driven_Development>`_-style
specifications. Buster's spec tests supports the same features as the
xUnit-style :ref:`test cases <buster-test-case>` but with a syntax closer to
BDD-style frameworks such as `RSpec <http://rspec.info/>`_, `Jasmine
<http://pivotal.github.com/jasmine/>`_ and others.

:func:`buster.spec.describe` produces :ref:`test context objects
<test-context-object>` that can be run using the :ref:`buster-test-runner`.


Unboxing the namespace
======================

One of Buster's core principles is to not pollute the global environment. For
this reason we only add one single global object -- ``buster``. However, in
some cases, like this one, the namespaces seriously desugars your code. For
this reason, the ``spec`` module has a :func:`buster.spec.expose` method that
allows you to use :func:`describe <buster.spec.describe>`, :func:`it
<buster.spec.it>` and the others without the ``buster.spec`` prefix::

    buster.spec.expose();

    describe("Namespace-less functions for ya", function () {
        // ...
    });


Describe
========

.. function:: buster.spec.describe(name, callback)

    Creates a specification. The ``name`` should be a string, and the
    ``callback`` can be used to further describe your specification.


Example: Bowling kata
---------------------

The following example shows some specs from `the bowling kata
<http://butunclebob.com/ArticleS.UncleBob.TheBowlingGameKata>`_, using a
``before`` method.

::

    buster.spec.expose(); // Make functions global

    var spec = describe("Bowling kata", function () {
        before(function () {
            this.game = new BowlingGame();

            this.rollMany = function (rolls, pins) {
                for (var i = 0; i < rolls; ++i) {
                    this.game.roll(pins);
                }
            };
        });

        it("yield 0 in score for gutter game", function () {
            this.rollMany(20, 0);
            buster.assert.equals(0, this.game.score());
        });

        it("yield score of 20 for 1 pin on each roll", function () {
            this.rollMany(20, 1);
            buster.assert.equals(20, this.game.score());
        });
    });


Example: controller specs
-------------------------

The following (slightly more involved) example shows some specs from a todo
application's form controller. Nested describes are used to separate both
controller actions as well as successful and failed attempts at posting the
form. Note the use of nested setup methods -- both before callbacks will be run
(the outer first, then the inner) for each requirement in the "adding items"
specification.

::

    buster.spec.expose();

    var spec = describe("Form controller", function () {
        before(function () {
            this.form = document.createElement("form");
            this.form.innerHTML = "<fieldset>" +
                "<input type='text' name='item' id='item'>" +
                "</fieldset>";

            this.input = this.form.getElementsByTagName("input")[0];
            this.backend = { add: sinon.spy() };
            this.controller = todoList.formController.create(this.form, this.backend);
            this.callback = sinon.spy();
            this.controller.on('item', this.callback);
        });

        describe("adding items", function () {
            before(function () {
                this.input.value = "It puts the lotion in the basket";
            });

            describe( "successfully", function () {
                it("emit onItem on success", function () {
                    var item = { text: "It puts the lotion in the basket" };
                    sinon.stub(this.backend, "add").yields(item);

                    this.controller.addItem();

                    sinon.assert.calledOnce(this.callback);
                    sinon.assert.calledWith(this.callback, item);
                });

                it("clear form on success", function () {
                    this.input.value = "It puts the lotion in the basket";
                    this.backend.add = sinon.stub().yields({});

                    this.controller.addItem();

                    buster.assert.equals("", this.input.value);
                });
            });

            describe("unsuccessfully", function () {
                it("render error on failure", function () {
                    sinon.stub(this.backend, "add").yields(null);

                    this.controller.addItem();
                    var err = this.form.firstChild;

                    buster.assert.match(err, {
                        tagName: "p",
                        className: "error",
                        innerHTML: "An error prevented the item from being saved"
                    });
                });
            });
        });
    });


Nested describes
----------------

Calls to ``describe`` can be arbitrarily nested. See the explanation of
:ref:`nested-before-and-after` for an example of using nested describes.


.. _async-specs:

Asynchronous specs
==================

To create asynchronous specs (i.e. ones that the runner will wait for), the
spec function can either explicitly accept a single argument, which is a
function, **or** return a thenable promise.


Explicitly accepting an argument
--------------------------------

The argument passed to the spec is a function. When the function is called, the
asynchronous spec is deemed done. The idiomatic way of creating asynchronous
specs using this arguments looks like the following::

    buster.spec.expose();

    describe("Buster async specs", function () {
        it("be asynchronous", function (done) {
            setTimeout(function () {
                buster.assert(true);
                done();
            }, 100);
        });
    });

This assumes that the assertion framework can fail without throwing an error
(as an error would be intercepted as uncaught in the above example, if
intercepted at all). If this is not the case, you can make your assertions in a
callback to the ``done`` function::

    buster.spec.expose();

    describe("Buster async specs", function () {
        it("be asynchronous", function (done) {
            setTimeout(function () {
                done(function () {
                    buster.assert(true);
                });
            }, 100);
        });
    });


Returning a promise
-------------------

Specs can be made asynchronous by way of returning a promise. The spec runner
considers any object with a ``then`` method a promise::

    buster.spec.expose();

    describe("Buster async/promise specs", function () {
        it("be asynchronous", function () {
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
        });
    });

Note that this does not work entirely as expected unless your assertion
framework of choice is able to notify the runner of failure without throwing an
exception. If the assertion fails (and throws an exception), the promise will
never be resolved, thus the runner will fail the spec with a timeout, **not**
an assertion error.

The above example is very verbose, simply to illustrate the duck-typed nature
of promises. You can do better by using e.g. `when.js
<https://github.com/cujojs/when>`_::

    describe("Buster async/promise specs", function () {
        it("be asynchronous", function () {
            var deferred = when.defer();

            setTimeout(function () {
                buster.assert(true);
                deferred.resolver.resolve();
            }, 100);

            return deferred.promise;
        });
    });

Before and after callbacks can use the same mechanism to be asynchronous.


Before and after
================

Specs can use ``before`` and ``after`` callbacks. ``before`` callbacks are
called before every spec, and is a suitable place to put shared setup code::

    buster.spec.expose();

    var spec = describe("Spec with before", function () {
        before(function () {
            this.object = { id: 42 };
        });

        it("override id": function () {
            this.object.id = 43;
            buster.assert.equals(this.object.id, 43);
        });

        it("not have id equal 43": function () {
            // The object is recreated in setUp for each spec
            buster.assert.notEquals(this.object.id, 43);
        });
    });

Similarly, ``after`` callbacks can be used to clean up after each spec. Keep in
mind though, that the spec's ``this`` object is discarded and recreated for
each spec. If your specs are properly isolated you rarely need clean up.

::

    buster.spec.expose();

    var spec = describe("Spec with teardown", function () {
        after(function () {
            if (jQuery.ajax.restore) {
                jQuery.ajax.restore();
            }
        });

        it("make http request": function () {
            twitter.timeline("cjno", function () {});

            buster.assert(jQuery.ajax.calledOnce);
        });
    });


Using beforeAll() and afterAll()
--------------------------------

Buster.js supports ``beforeAll()`` and ``afterAll()`` functions much like the
ones in Rspec. For example, if you want to run a setup function once and then
make the specs evaluate the result, you can do as follows::

    function magicDoubler(number) {
        return number * 2;
    }

    buster.spec.expose();

    var spec = describe("The magic doubler", function () {
       beforeAll(function() {
           //magicDoubler is called only once.
           this.result; = magicDoubler(7);
       });

       it("should yield a defined result", function () {
           expect(this.result).toBeDefined();
       });

       it("should yield a number divisible by 2", function () {
           expect(this.result % 2 === 0).toBeTrue();
       });
    });

Similarly, you can use ``afterAll()`` to call a single teardown function that
runs after all specs have been executed.  This is useful for cleaning up after
a test that alters a model.


.. _nested-before-and-after:

Nested before and after
-----------------------

When nesting describes, you can add ``before`` and ``after`` callbacks to some
or all of your specs. All applicable ``before`` and ``after`` callbacks are
called before each spec function. ``before`` callbacks are called starting from
the outermost ``describe``, while ``after`` callbacks are called starting from
the spec's local ``describe``. Let's illustrate by way of an example::

    buster.spec.expose();

    var spec = describe("Nested before and after call order", function () {
        before(function () {
            console.log("Before #1");
        });

        after(function () {
            console.log("After #1");
        });

        it("do #1", function () {
            console.log("Spec #1");
        });

        describe("context", function () {
            before(function () {
                console.log("Before #2");
            });

            it("do #2", function () {
                console.log("Spec #2");
            });

            describe("context", function () {
                before(function () {
                    console.log("Before #3");
                });

                after(function () {
                    console.log("After #3");
                });

                it("do #3": function () {
                    console.log("Spec #3");
                });
            }
        }
    });

Will print:

.. code-block:: text

    Before #1
    Spec #1
    After #1
    Before #1
    Before #2
    Spec #2
    After #1
    Before #1
    Before #2
    Before #3
    Spec #3
    After #3
    After #1


Asynchronous before and after
-----------------------------

Before and after callbacks are treated as asynchronous by the test runner if
they either return a thenable promise or if they explicitly accept an argument.
See :ref:`async-specs`.


.. _deferred-specs:

Deferred specs
==============

If you have written a spec that for some reason is impossible to pass in the
near future, you may grow tired of seeing it fail while working on other parts
of the system. Because the spec may represent an important goal/requirement
(perhaps the goal of a longer refactoring session) it is undesirable to delete
it. Simply commenting out the spec may cause you to forget it and commit
commented out code, which isn't very nice.

Buster recognizes the valid use of deferred specs and provides a simple way to
defer a spec -- simply change ``it`` to the aptly named ``itEventually``::

    buster.spec.expose();

    var spec = describe("Bowling kata", function () {
        before(function () {
            this.game = new BowlingGame();

            this.rollMany = function (rolls, pins) {
                for (var i = 0; i < rolls; ++i) {
                    this.game.roll(pins);
                }
            };
        });

        it("yield 0 in score for gutter game", function () {
            this.rollMany(20, 0);
            buster.assert.equals(0, this.game.score());
        });

        itEventually("yield score of 20 for 1 pin on each roll", function () {
            this.rollMany(20, 1);
            buster.assert.equals(20, this.game.score());
        });
    });

In this example, the second spec will not run, but **the reporter will include
it** and explicitly mark it as deferred, helping you avoid forgetting about it.
