.. highlight:: html
.. _browser-testing:

===============
Browser testing
===============

Buster.JS offers multiple ways of running your tests in browsers. This
document describes three ways, ranging from simple setup to most useful (if
that's a scale).


Running with ``buster-server``
==============================

Inspired by JsTestDriver, Buster.JS can automate browsers seamlessly and
provide feedback anywhere you want, making running your tests in actual
browsers easy and painless. Hell, it even makes it fun.

First, start a server:

.. image:: _static/overview/buster-server-start.png
    :width: 633
    :height: 382

Then, capture how many browsers you want:

.. image:: _static/overview/buster-server-capture-firefox.png
    :width: 827
    :height: 339

And simultaneously run tests on all the captured browsers:

.. image:: _static/overview/buster-test-run-browsers.png
    :width: 633
    :height: 382


Running with ``buster-static``
==============================

In the cases where you need a simpler method for running tests, but don't care
for the manual HTML scaffold (see next section), Buster.JS can serve the
scaffold for you based on your configuration.

Start the server:

.. image:: /_static/overview/buster-static-start.png
    :width: 697
    :height: 355

Open the page in the browser and watch the tests run immediately:

.. image:: /_static/overview/buster-static-success.png
    :width: 697
    :height: 470

Write to disk with ``buster-static``
====================================

If you specifiy a directory when executing ``buster-static``, no sever will be started.
Instead the files needed for the test run are written into this directory.
All you have to do to run the tests is to open the ``index.html`` file in a browser.

.. image:: /_static/overview/writeToDisk.png
    :width: 697
    :height: 355


Using an HTML scaffold
======================

.. warning::

    This is still an experimental feature, but should work fine.

The simplest way to try Buster.JS is to copy the following code, save it to a
file and run it in a browser:

.. code-block:: html

    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
               "http://www.w3.org/TR/html4/strict.dtd">
    <html>
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>strftime</title>
      </head>
      <body>
        <script type="text/javascript" src="http://cdn.busterjs.org/releases/latest/buster-test.js"></script>
        <script type="text/javascript" src="http://cdn.busterjs.org/examples/strftime/strftime.js"></script>
        <script type="text/javascript" src="http://cdn.busterjs.org/examples/strftime/strftime-test.js"></script>
      </body>
    </html>

Go ahead, `try it <http://cdn.busterjs.org/examples/strftime/>`_.

If you use Git, you can clone `this example <https://gist.github.com/1904218>`_
to your machine::

    git clone git://gist.github.com/1904218.git gist-1904218

.. note::

    If you opt for :doc:`downloading <download>` the script locally, remember
    to get the CSS file too. When using the pre-built library, there's no
    installation, but you also miss out on much of the automation sweetness.


Running headless with PhantomJS
===============================

You can run browser tests headless with PhantomJS very easy by starting the server with option ``-c``.

.. image:: /_static/overview/headless-browser.png
    :width: 697
    :height: 355

You must have installed `PhantomJS <http://phantomjs.org//>`_ on your system of course.


Continues Integration
=====================

You can run the buster server, capture browsers, on the local or remote machine, run tests,
close the browsers and shutdown the server with only one command: :ref:`buster-ci`. 


Examples
========

Check the `demos repository <https://github.com/busterjs/demos>`_ for example projects.


