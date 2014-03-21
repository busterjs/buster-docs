.. default-domain:: js
.. highlight:: javascript
.. _buster-server-cli:

=================
buster-server-cli
=================

Version:
    0.1.0 (2012-05-14)
Module:
    ``require("buster-server-cli");``
In browsers:
    N/A

Command-line interface API for running :ref:`ramp` instances
with a simple interface that allows capturing and viewing a list of connected
browsers.

In Buster, this module is the implementation of the ``buster-server`` command.
It does not define the binary however, as it is intended to be generic enough
to be reused outside of Buster.


Possible use cases
==================

The capture server is the central piece in Buster's multiple browser automation
capabilities. This module can be used as is to run tests for any framework, as
it does not know anything about tests at all. However, if you're shipping a
capture server for your own framework, you may want to brand your server a
little.

The following example shows how to create a custom capture server for the
fictional *checkit* test framework.


The binary
----------

::

    // checkit/bin/checkit-server
    var path = require("path");
    var serverCli = require("buster-server-cli");

    serverCli.create(process.stdout, process.stderr, {
        missionStatement: "Checkit crazy multi-browser test runner server",
        description: "checkit-server [options]",
        templateRoot: path.join(__dirname, "..", "views"),
        documentRoot: path.join(__dirname, "..", "public")
    }).run(process.argv.slice(2));


The index template
------------------

You need to define two templates for the server to work correctly. The first
one is ``index.ejs``, which is an `ejs <http://embeddedjs.com/>`_
template for the index page of the server.

`Buster's index template
<https://github.com/busterjs/buster-server-cli/blob/master/views/index.ejs>`_
renders a list of captured browsers and a link to `/capture`, which is the URL
that causes the browser to become a captured slave.

The ``index.ejs`` template is rendered with one piece of data — ``slaves`` —
which is an array of slave objects:

.. attribute:: slave.browser

    A string, i.e. "Firefox"

.. attribute:: slave.platform

    A string, i.e. "Linux"

.. attribute:: slave.version

    A string, i.e. "12.0"

.. attribute:: slave.os

    A string, contains a richer OS/platform description

.. attribute:: slave.userAgent

    The original user agent


The header template
-------------------

The second template is the ``header.ejs`` template. It is used in the top frame
in the frameset that is displayed in captured slaves. Currently this is just a
static template, but future versions will expose an API to communicate with the
server here to display progress etc.

See `Buster's header template
<https://github.com/busterjs/buster-server-cli/blob/master/views/header.ejs>`_
for a reference implementation.
