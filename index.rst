========================
Welcome! Buster.JS is...
========================

**In beta.** Many things are unstable at this point in time. We aim to release a
stable 1.0 by end of June 2012.

**A browser JavaScript testing toolkit.** It does browser
testing with browser automation (think JsTestDriver), qunit style static html
page testing, testing in headless browsers (phantomjs, jsdom, ...), and more.
Take a look at :doc:`the overview <overview>`!

**A Node.js testing toolkit.** You get the same test case library, assertion
library, etc. This is also great for hybrid browser and Node.js code. Write
your test case with Buster.JS and run it both in Node.js and in a real browser.

**Flexible.** There's a public API for almost everything. You
can write reporters for customizing the output of ``buster test`` (we
already have xUnit XML, traditional dots, specification, tap, TeamCity and
more), write extensions that wrap other testing frameworks (we already have
buster-jstestdriver), add your own testing syntax (we ship with xUnit and BDD),
and much more. Again, :doc:`the overview <overview>` lists many of these
things.

**Written by you.** We believe in open development, and already
have a dozen or so contributors beyond the core authors of Buster.JS, August
Lilleaas and Christian Johansen. All development happens in public in the
`issue tracker <https://github.com/busterjs/buster/issues>`_ and the
`busterjs-dev mailing list <http://groups.google.com/group/busterjs-dev>`_. We
welcome your opinion.

**A set of reusable libraries.** For example, buster-capture-server is our
generic browser automation library that lets you successively load webpages
into browsers and send data to and from them. It is completely reusable and has
no knowledge of Buster.JS tests, or tests at all for that matter.

**The future.** We have big plans for buster in the months and years to come. For
example, we'll add the ability to run your browser tests directly on
`BrowserStack <http://www.browserstack.com/>`_. In development you can still
capture a local browser, JsTestDriver style. But instead of setting up your own
CI server with a bazillion browsers, pay BrowserStack to do the job for you.
Other plans we have is to have a stateful test runner that only runs the
previously failed tests, test breakpoints that drops you into a live REPL in
all the captured browsers when a test fails, and much much more.

:doc:`Take Buster.JS for a spin <getting-started>` and **judge for yourself!**
Be warned, it's still in beta, so it has some rough edges.


User's guide
============

These are articles, howtos, and guides to help get started with Buster.JS.

.. toctree::
    :maxdepth: 2

    talks
    overview
    getting-started
    browser-testing
    node-testing
    hybrid-testing
    testcase


Reference documentation
=======================

These are guides and API documentation for the individual Buster.JS core
modules and extensions.

.. toctree::
    :maxdepth: 2

    modules/index
    extensions/index


Project resources
=================

Here you can find out more about the Buster.JS project, changelogs, how to
contribute, etc.

.. toctree::
    :maxdepth: 2

    download
    community
    developers/index
    changelog
