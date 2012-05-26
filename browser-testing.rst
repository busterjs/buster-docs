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


Running with ``buster static``
==============================

.. warning::

    This is still an experimental feature, but should work fine.

In the cases where you need a simpler method for running tests, but don't care
for the manual HTML scaffold (see next section), Buster.JS can serve the
scaffold for your based on your configuration.

.. image:: /_static/overview/buster-static-start.png
    :width: 529
    :height: 348

.. image:: /_static/overview/buster-static-success.png
    :width: 514
    :height: 470


Using an HTML scaffold
======================

.. warning::

    This is still an experimental feature, but should work fine.

The simplest way to try Buster is to copy the following code, save it to a
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
        <script type="text/javascript" src="http://busterjs.org/releases/latest/buster-test.js"></script>
        <script type="text/javascript" src="http://busterjs.org/examples/strftime/strftime.js"></script>
        <script type="text/javascript" src="http://busterjs.org/examples/strftime/strftime-test.js"></script>
      </body>
    </html>

Go ahead, `try it <examples/strftime/>`_.

If you use Git, you can clone `this example <https://gist.github.com/1904218>`_
to your machine::

    git clone git://gist.github.com/1904218.git gist-1904218

.. note::

    If you opt for :doc:`downloading <download>` the script locally, remember
    to get the CSS filetoo. When using the pre-built library, there's no
    installation, but you also miss out on much of the automation sweetness.


Running headless with PhantomJS
===============================

.. warning::

    This feature has not yet landed in the beta.
