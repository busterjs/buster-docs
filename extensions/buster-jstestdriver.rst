.. _buster-jstestdriver:
.. highlight:: javascript

===================
buster-jstestdriver
===================

Run test cases written for JsTestDriver with the Buster runner. The extension
does not currently support ``:DOC`` style comments or async test
cases.


Install
=======

Installation is done using npm::

    npm install buster-jstestdriver


Usage
=====

Load in your configuration file::

    var config = module.exports;

    config["Browser tests"] = {
        rootPath: "../",
        sources: ["src/**/*.js"],
        tests: ["test/**/*.js"],
        extensions: [require("buster-jstestdriver")]
    };


Source code
===========

`busrer-jstestdriver on GitHub <https://github.com/busterjs/buster-jstestdriver>`_
