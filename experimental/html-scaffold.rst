.. highlight:: html

======================
Using an HTML scaffold
======================

The simplest way to try Buster is to copy the following code, save it to a
file and run it in a browser:::

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

    If you opt for downloading the script locally, remember to get the
    `CSS file <releases/latest/buster-test.css>`_ too.  When using the
    pre-built library, there's no installation, but you also miss out on much
    of the automation sweetness.
