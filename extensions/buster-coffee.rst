.. _buster-coffee:
.. highlight:: javascript

=============
buster-coffee
=============

Automatically compile CoffeeScript files before running tests. In its current
state, this extension does not work for files that are to be included using
``require()``, and is thus not very useful for Node.js projects.


Install
=======

Installation is done using npm::

    npm install buster-coffee


Usage
=====

Load in your configuration file::

    var config = module.exports;

    config["Browser tests"] = {
        environment: "browser",
        rootPath: "../",
        sources: ["src/**/*.coffee"],
        tests: ["test/**/*.coffee"],
        extensions: [require("buster-coffee")]
    };


Source code
===========

`buster-coffee on GitHub <https://github.com/busterjs/buster-coffee>`_
