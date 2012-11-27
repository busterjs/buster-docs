=======================================
Creating your own xx-server and xx-test
=======================================

This howto explains by example how to use several Buster.JS libraries to provide
a server (like ``buster-server``) and CLI to automate tests written with your
favorite test framework across multiple browsers (like ``buster-test``).

In this howto we will reuse most of the Buster.JS toolchain, but it will be
branded as another test framework, and we will replace most of the code that
runs in the browsers. The resulting tools will follow the same basic flow as
``buster-test`` does, but it will be tailored to another test framework.

The test framework
==================

As an example, this howto will focus on building up a toolchain for the
lightweight test framework, ``srsly``, first introduced in `a previous howto
</howto/shimming-test-runner.html>`_. It looks like the following:

::

    srsly("rot13 encodes text", rot13("hello"), "uryyb");
    srsly("does not rot13 encode numbers", rot13("1234"), "1234");
    srsly("rot13 encodes captial letters", rot13("ABCDE"), "NOPQR");
    srsly.checkit();

Initial setup
=============

We will set up a new project to host the CLI tooling for ``srsly``. Start by
making a directory to house it, e.g. ``srsly-automate``. Inside that directory,
create a ``bin`` directory and add a ``package.json`` file with the following
contents:

::

    {
        "name": "srsly-automate",
        "version": "0.2.0"
    }

``buster-server`` starts a server that is capable of capturing browsers as
slaves, ready to execute any task. The server is a completely vanilla capture
server, and does nothing Buster.JS-specific other than the visual styles. In
other words, you can easily use ``buster-server`` with e.g. ``srsly-test``,
which is exactly what we'll do while we carve out our ``srsly-test`` CLI. Later,
we will make our very own version of the server CLI as well.

The test CLI
============

The functionality provided by the ``buster-test`` binary is implemented as a
library in the `buster-test-cli <http://github.com/busterjs/buster-test-cli>`_
module. Making our own is as easy as calling a couple of functions from it,
providing the right values, and, less easy, to provide the browser
implementation for our test-framework.

We start by creating a binary that does pretty much the same thing as
``buster-test``, then we'll replace the browser stuff. First of all, let's add
``buster-test-cli`` as a dependency to our ``package.json``. While we're at it,
we will declare our first binary as well.

::

    {
        "name": "srsly-automate",
        "version": "0.1.0",
        "bin": {
            "srsly-test": "./bin/srsly-test"
        },
        "dependencies": {
            "buster-test-cli": "~0.6.2"
        }
    }

The binary goes in ``bin/srsly-test``, and looks like the following:

::

    #!/usr/bin/env node
    var testCli = require("buster-test-cli");

    testCli.create(process.stdout, process.stderr, {
        missionStatement: "Automate SRSLY tests across multiple browsers",
        description: [
            "Usage: srsly-test [options] [filters]\n",
            "Optionally provide a test name filter to run a selection of tests:",
            "`srsly-test configuration` runs all contexts/tests with the word",
            "'configuration' in their name."
        ].join("\n"),
        environmentVariable: "SRSLY_TEST_OPT",
        configBaseName: "srsly",
        runners: { browser: testCli.runners.browser }
    }).run(process.argv.slice(2), function (err) {
        if (err) { process.exit(1); }
    });

This is mostly how the ``buster-test`` binary looks, save for the customized
values and some lines we will add shortly. We will discuss each property in
turn.

missionStatement and description
--------------------------------

Both of these properties appear when executing ``srsly-test --help``. The
``missionStatement`` property should contain a spiffy one-line summary of what
the tool does. This is a convention used across Buster.JS CLIs.

environmentVariable
-------------------

This property names the environment variable that can be used to set additional
command line arguments to pass to the binary. This feature allows users to affix
certain arguments in their shell configuration files etc (effectively overriding
defaults). With the value we provided, we could put the following in
``~/.bashrc`` (assuming we're using bash):

::

    export $SRSLY_TEST_OPT="-r specification"

And the default reporter would be the "specification" reporter.

configBaseName
--------------

Similar to ``environmentVariable``, the config base name decides what the
default configuration files are named like, and where to find further
customization. Given our example, the binary will look for either one of
``./srsly.js``, ``./test/srsly.js`` or ``./spec/srsly.js`` as the default
configuration file. The binary will also load settings for certain properties
from one of ``~/.srsly``, ``~/.srsly.js`` or ``~/.srsly.d/index.js`` if either
exists.

runners
-------

This property holds runners for named environments. Note:
``require("buster-test-cli").runners`` will likely be extracted as a separate
module for the 1.0 release of Buster.JS. We cannot simply provide the entire
``runners`` object exported by the test-cli module, as its node environment is
not useful for the ``srsly`` test framework. Instead, we borrow only the browser
environment. If we want, we can implement more runners and add them here, but
that's the topic of another howto.

Loading files in the browser
----------------------------

So far, one crucial bit is missing: What files will the binary load in the
browser when we issue a test run? The answer is none, because we haven't told it
what files to load yet. Phew, I guess you were worried that the library just
assumed Buster.JS there for a while, eh?

The ``buster-test`` binary preloads three extensions that define the Buster.JS
testing framework: The "framework" extension, the capture server wiring
extension, and the `buster-syntax <http://github.com/busterjs/buster-syntax>`_
extension.

The server CLI
==============

As we saw earlier, ``buster-server`` starts a server that can capture browsers
as slaves, ready to execute any task. While it is perfectly capable of being the
server for our custom test framework we want our tooling to have its look and
feel and, importantly, it's own binary.

The `buster-server-cli <https://github.com/busterjs/buster-server-cli>`_ module
implements the CLI logic for starting and stopping a capture server instance,
and conveniently provides an API to skin it. Creating a server CLI that looks
exactly like ``buster-server`` is done by creating a new instance of
``buster-server-cli`` and running it:

::

    #!/usr/bin/env node

    require("buster-server-cli").create(
        process.stdout,
        process.stderr
    ).run(process.argv.slice(2));

Save this in ``bin/srsly-server`` and make it executable by issuing ``chmod +x
bin/srsly-server``. As you can see, we are explicitly handing it the output and
error streams it should use, as well as the arguments to parse. To use this
binary we have to add it to our ``package.json``:

::

    {
        "name": "srsly-automate",
        "version": "0.2.0",
        "bin": {
            "srsly-server": "./bin/srsly-server"
        },
        "dependencies": {
            "buster-server-cli": "~0.1.1"
        }
    }

You should be able to start the server by issuing ``./bin/srsly-server``.
Several strange things will jump at you: The CLI says
"buster server running on ..." and the webpage features the Buster.JS
look'n'feel. Also, if you try issuing ``./bin/srsly-server --help`` you will
note that the output is supsiciously quiet. Let's start by fixing that last
issue:

::

    #!/usr/bin/env node

    require("buster-server-cli").create(process.stdout, process.stderr, {
        binary: "srsly-server",
        description: "Usage: srsly-server [options]",
        missionStatement: "Server for automating srsly test runs across browsers"
    }).run(process.argv.slice(2));

This new version looks a lot better when doing ``./bin/srsly-server --help``.
There's one more detail to tend to. Sometimes, the server will run into
unexpected errors, at which point it prints a (hopefully) helpful message. This
message is pluggable, as it should contain some project-specific information on
how to proceed:

::

    #!/usr/bin/env node

    require("buster-server-cli").create(process.stdout, process.stderr, {
        binary: "srsly-server",
        description: "Usage: srsly-server [options]",
        missionStatement: "Server for automating srsly test runs across browsers",
        unexpectedErrorMessage: "Something went horribly wrong. This is most likely " +
            "a bug, please report at\nhttp://srsly.com/issues\n"
    }).run(process.argv.slice(2));

Obviously, srsly.com does not exist, the message is modeled after what Buster.JS
uses. You get the point. Now, when you start the server, you get a nice
customized message informing you that the server is running.

Skinning the web page
---------------------

The next piece of the puzzle is to get rid of the Buster.JS look on the web
page. There's two things we can do to influence this. Let's start by giving the
server a custom public directory:

::

    #!/usr/bin/env node
    var path = require("path");

    require("buster-server-cli").create(process.stdout, process.stderr, {
        binary: "srsly-server",
        description: "Usage: srsly-server [options]",
        missionStatement: "Server for automating srsly test runs across browsers",
        unexpectedErrorMessage: "Something went horribly wrong. This is most likely " +
            "a bug, please report at\nhttp://srsly.com/issues\n",
        documentRoot: path.join(__dirname, "..", "public")
    }).run(process.argv.slice(2));

Create the ``public`` directory in the root of the project, and add another
directory with a file in it at ``./public/stylesheets/buster-server.css``.
Restart the server, and you should be presented with a "naked" HTML page.
Unfortunately, said page features a glaring "Buster.JS". There's two ways to fix
that. Let's do the easy fix first:

::

    #!/usr/bin/env node
    var path = require("path");

    require("buster-server-cli").create(process.stdout, process.stderr, {
        name: "SRSLY",
        binary: "srsly-server",
        description: "Usage: srsly-server [options]",
        missionStatement: "Server for automating srsly test runs across browsers",
        unexpectedErrorMessage: "Something went horribly wrong. This is most likely " +
            "a bug, please report at\nhttp://srsly.com/issues\n",
        documentRoot: path.join(__dirname, "..", "public")
    }).run(process.argv.slice(2));

The name property is what's used in the web pages. It may contain markup. At
this point you should have a naked web page with the name of your test framework
on it. You may style it to your heart's content.

Further personalizing the server
--------------------------------

If the CSS-only theming of the server pages isn't enough, you can provide your
own templates for the capture page and the "catured slave" page. To do this,
provide ``templateRoot`` option that points to where your templates are located.
Unfortunately, if you override one, you must override both. For your reference,
here are the two default ejs templates.

::

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Capture test slave</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/buster.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/buster-server.css">
      </head>
      <body>
        <div id="masthead">
          <p><a href="/"><%- name %></a> Test automator</p>
        </div>
        <div class="content">
          <h1>Capture browser as test slave</h1>
          <p>
            Hit the button below, then leave the browser running. <%- name %> can
            then use it to automate test runs for you.
          </p>
          <p class="button"><a href="/capture">Capture browser</a></p>
          <% if (slaves.length > 0) { %>
            <h2>Captured slaves (<%= slaves.length %>)</h2>
            <ol class="browsers">
              <% for (var i = 0, l = slaves.length; i < l; ++i) { %>
                <%
                  var agent = slaves[i], css_classes = [];
                  css_classes.push(/internet explorer/i.test(agent.browser) ? 'ie' : agent.browser.toLowerCase())
                  css_classes.push(agent.platform.toLowerCase().replace(/\s/g, '_'))
                %>
                <li class="<%= css_classes.join(' ') %>">
                  <div>
                    <h3><%= agent.browser %> <%= agent.version %> | <%= agent.os %></h3>
                    <p><%= agent.userAgent %></p>
                  </div>
                </li>
              <% } %>
            </ol>
          <% } else { %>
            <h2>No captured slaves</h2>
          <% } %>
        </div>
      </body>
    </html>

The data provided to this template is ``name`` and ``slaves``, which is an array
of objects with the properties ``browser, platform, version, os, userAgent``.

The header template renders the header on the "captured slave" page:

::

    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>Captured test slave</title>
        <link rel="stylesheet" type="text/css" href="/stylesheets/buster.css">
        <link rel="stylesheet" type="text/css" href="/stylesheets/buster-server.css">
      </head>
      <body>
        <div id="masthead">
          <p><a href="/"><%- name %></a> Test slave: Running<span></span></p>
        </div>
      </body>
    </html>
