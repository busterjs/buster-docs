.. default-domain:: js
.. highlight:: javascript
.. _buster-sinon:

============
buster-sinon
============

`Sinon.JS <http://sinonjs.org/>`_ integration.

.. warning:
  This documentation is incomplete.

Sinon specific assertions are documented at :ref:`referee`.

Refer to `the Sinon.JS documentation <http://sinonjs.org/docs/>`_ and do some
guesswork for the other functionality.

Quick cheat sheet::

    buster.testCase("Foo", {
        "test a stub": function () {
            // Overrides "aMethod" and restores when test finishes running
            this.stub(myLib, "aMethod");
            myLib.otherThing();
            assert.calledOnce(myLib.aMethod);
        },

        "test a spy": function () {
            // Wraps "aMethod". The original method is called, and you can also
            // do stub like assertions with it.
            this.spy(myLib, "aMethod");
            myLib.otherThing();
            assert.calledOnce(myLib.aMethod);
        }
    });

And much, much more!
