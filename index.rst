========================
Welcome! Buster.JS is...
========================

**In beta.** Many things are unstable at this point in time. Check out
:doc:`the roadmap <roadmap>`.

**A browser JavaScript testing toolkit.** It does browser
testing with browser automation (think JsTestDriver), QUnit style :ref:`static HTML
page testing <buster-static>`, testing in headless browsers (PhantomJS, jsdom),
and more. Take a look at :doc:`the overview <overview>`!

**A Node.js testing toolkit.** You get the same test case library, assertion
library, etc. This is also great for hybrid browser and Node.js code. Write
your test case with Buster.JS and run it both in Node.js and in a real browser.

**Flexible.** There's a public API for almost everything. You
can write :ref:`reporters <buster-test-reporters>` for customizing the output
of :program:`buster test` (we already have xUnit XML, traditional dots,
specification, tap, TeamCity and more), write extensions that wrap other
testing frameworks (we already have :ref:`buster-jstestdriver`), add your own
testing syntax (we ship with :ref:`xUnit <buster-test-case>` and :ref:`BDD
<buster-test-spec>`), and much more. Again, :doc:`the overview <overview>`
lists many of these things.

**Written by you.** We believe in open development, and already
have a dozen or so contributors beyond the core authors of Buster.JS, August
Lilleaas and Christian Johansen. All development happens in public in the
`issue tracker <https://github.com/busterjs/buster/issues>`_ and the
`busterjs-dev mailing list <http://groups.google.com/group/busterjs-dev>`_. We
welcome your opinion.

**A set of reusable libraries.** For example, :ref:`ramp` is
our generic browser automation library that lets you successively load webpages
into browsers and send data to and from them. It is completely reusable and has
no knowledge of Buster.JS tests, or tests at all for that matter.

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
    starting-testrun-manually


Reference documentation
=======================

These are guides and API documentation for the individual Buster.JS core
modules and extensions. See the :ref:`genindex` if you are looking for the docs
for a particular part of the API.

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
    contributors
    developers/index
    roadmap
    changelog
    licenses
