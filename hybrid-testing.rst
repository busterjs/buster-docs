.. highlight:: javascript

==============
Hybrid testing
==============

.. warning:: 

  This document is work in progress


Writing hybrid tests
====================

Running tests in both browsers and Node requires a small feature test to
determine whether or not to load Buster in your tests. The code under test
obviously also needs to check for ``module``, ``require`` etc. The following
example shows a typical test that runs both in browsers and on node::

    if (typeof module == "object" && typeof require == "function") {
        var buster = require("buster");
    }

    buster.testCase("Multi-environment", {
        "runs in all environments": function () {
            assert(true);
        },

        "sub context": {
            requiresSupportFor: { "DOM": typeof document != "undefined" },

            "only runs in browser-like environments": function () {
                // ...
            }
        }
    });


Running tests
=============

The simplest way to run multi-environment tests is to use a configuration file
and the ``buster test`` binary::

    var config = module.exports;

    config["Tests"] = {
        tests: ["test/**/*.js"]
    };

    config["Browser tests"] = {
        extends: "Tests",
        environment: "browser",
        sources: ["lib**/*.js"]
    };

    config["Node tests"] = {
        extends: "Tests",
        environment: "node"
    };

Given this config, you can run for Node.js using::

    buster test --node

and for browsers::

    buster test --browser
