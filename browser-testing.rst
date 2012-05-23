.. highlight:: html

===============
Browser testing
===============

Buster.JS offers multiple ways of running your tests in browsers. This
document describes three ways, ranging from simple setup to most useful (if
that's a scale).


Running with ``buster server``
==============================

Inspired by JsTestDriver, Buster.JS can automate browsers seamlessly and
provide feedback anywhere you want, making running your tests in actual
browsers easy and painless. Hell, it even makes it fun.

.. image:: _static/overview/buster-server-start.png
    :width: 633
    :height: 382

.. image:: _static/overview/buster-server-capture-firefox.png
    :width: 827
    :height: 339

.. image:: _static/overview/buster-test-run-browsers.png
    :width: 633
    :height: 382


Experimental features
=====================

There are also a couple of other ways you can run your browser tests with
Buster.JS. These features are experimental, but should work fine:

.. toctree::
    :maxdepth: 1

    experimental/buster-static
    experimental/html-scaffold
    experimental/phantom
