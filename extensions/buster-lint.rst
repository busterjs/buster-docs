.. _buster-lint:
.. highlight:: javascript

===========
buster-lint
===========

Incorporate linting (JsLint or JsHint) in your test runs. Optionally fail test
runs if lint is found.

Install
-------

Installation is done using npm: ``npm install buster-lint``.

Usage

Load in your configuration file::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-lint")]
    };

Configure
---------

Configuration options are those supported by the wonderful 
`autolint <https://github.com/magnars/autolint>`_ tool by Magnar Sveen.
In fact, if you're already using autolint, you can integrate it with
Buster.JS by simply requiring your existing configuration (assuming you're not
still using pre-1.0 json config files)::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-lint")],
        "buster-lint": require("./autolint")
    };

If you don't already have an autolint configuration, here's to get you
started. All options are documented `in the GitHub repository <https://github.com/magnars/buster-lint>`_.::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-lint")],
        "buster-lint": {
            linterOptions: {
                node: true
            },

            excludes: [
                "jquery",
                "underscore",
                "raphael"
           ]
        }
    };

Source
^^^^^^

`buster-lint on GitHub <https://github.com/magnars/buster-lint>`_