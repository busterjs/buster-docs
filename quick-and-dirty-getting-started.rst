.. default-domain:: js
.. highlight:: javascript
.. _quick-and-dirty-getting-started:

===============================
Quick and dirty getting started
===============================

It's so quick. And dirty!

Install
=======

.. code-block:: sh

    npm install -g buster

Then you need to either have ``NODE_PATH`` set up or also ``npm link buster``
(without ``-g``) in the project where you want use Buster.


Config file
===========

Put it in ``test/buster.js`` in your project. Or ``spec/buster.js``. Or
anywhere, and ``buster test -c path/to/config-file``.

::

    var config = module.exports;

    config["Node tests"] = {
        environment: "node",
        tests: ["test/*.js"]
    };


Write a test
============

In, say, ``test/my-test.js``::

    var buster = require("buster");
    buster.testCase("omg wtf bbq", {
        setUp: function () {
        },

        "test a test": function () {
            buster.assert(true);
            // There's no assert.notEquals. Use refute.equals for symmetry win.
            buster.refute.equals("foo", "bar");
        },


        "test another test": function (done) {
            // This is an asynchonous test. It won't be considered successfull
            // until the done function is called.
            setTimeout(function () {
                buster.assert(true);
                done();
            }, 1000);
        },

        "a context": {
            setUp: function () {
                // With it's own setUp and tearDown that "inherits" from parent.
            },

           "and more tests": function () {
           }
        }
    });


Run it
======

Run the ``buster test`` command. See also ``buster test --help``.
