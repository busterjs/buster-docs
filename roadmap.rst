.. _roadmap:

=======
Roadmap
=======

This is a rough road map of how we imagine getting Buster.JS to a rock solid
v1.0. When we slap Buster.JS with the big 'ole "1.0", we guarantee that:

* Tests will not break (false positives/negatives, other breakage) when upgrading Buster.JS
* Extensions will not break from one release to another
* The APIs that make up Buster.JS will stay backwards-compatible
* The testing experience will be stable and fun
* Buster.JS works equally well on Linux, Windows and OSX

Another goal of 1.0 is to have APIs that we feel gives us some room to "grow"
new features in the future. Obviously, this is a "soft goal", and one that's
hard to quantify, but it will at least account for some of the more lofty
dreams we currently have.

When will you support Windows?
==============================

Don't know. The issue is slowly being worked on, and it's a requirement for us
to tag Buster.JS with "1.0". If you use Windows and want to see this happen,
please consider helping. :doc:`Windows support status <developers/windows>`

Buster.JS 0.6 (AKA Beta 4)
==========================

Beta 4 is expected in early June 2012. It features several rewritten/reworked
modules, deprecates some old ones, and should generally vastly improve the
stability of browser tests. It will also improve browser support for older
browsers.

Highlights
----------

* **New** :doc:`buster-capture-server <modules/buster-capture-server>`.
  A more stable implementation, better handling of connection edge-cases,
  better suited for older browsers.
* **Revamped** ``buster-server`` **CLI**.
  Mostly interesting for people looking to reuse Buster.JS' server components
  for other testing frameworks. The new implementation allows skinning and
  customization, and separates it from the implementation of other CLIs.
* **Revamped** ``buster-test`` **CLI**
  Huge changes in APIs, focusing on reusability. The CLI is now completely
  generic, and does not come with any pre-existing knowledge about the
  Buster.JS testing framework. The specifics are injected at runtime, which
  means the ``buster-test`` "binary"/script. Some minor tweaks in
  user-facing behavior.
* Any module that does not have pending changes will be tagged as 1.0.

Status
------

* The browser-runner in the ``buster-test`` CLI is close to complete
* Some pending API additions in the capture server's client

Buster.JS 0.7 (AKA Beta 5/RC 1)
===============================

The final two "big" changes will land. Bug fixes. New documentation site.

Highlights
----------

* **buster-resources API change**. 
  The proposed change gives
  resources the ability to have multiple representations, based on the desired
  content type. This will significantly up the game for extensions that make
  big changes to resources, such as compile-to languages and other
  pre-processors.
* ``buster-test`` **changes**. 
  Currently, every configuration group is run as isolated test runs, and the 
  dots reporter has a very specific mode for the multi-browser runs. The 
  proposed change fixes both of these by representing all configuration groups
  with a test runner. All of them will be coordinated by a master 
  "multi runner", and this is where you plug in the reporters etc. This 
  removes some duplication in the implementation, makes it possible to have
  e.g. one XML report for any number of buster.js configuration files, and
  makes environments a native part of the test runner/reporters.
* **New documentation site**.
  Work is being put into a new documentation site based on Sphinx. There are
  plans for API docs to be extracted from module Readme's and source code.
  The site is proposed to launch with Buster.JS 0.7.
* **buster-assertions 1.0**. 
  There's currently a pending change
  for ``assert.exception``. Additionally, buster-assertions' equals
  and match algorithms will be extracted into a separate module (that among
  others Sinon.JS will use).

Status
------

Not yet in progress. Expected to complete early July, but may delay into
August due to vacations and so on. This page will be updated with todo
items and individual progress when 0.6 is out.

Release candidates
==================

If necessary, we will fix bugs and iron out issues from 0.7 and release as
successive RC's until things stableize. At this point, we expect roughly one
RC per week/two weeks until we hit the sweet-spot, which is...

Buster.JS 1.0
=============

Buster.JS 1.0 will be released when 0.7 has been tested in the wild, any
breaking bugs have been fixed, and all current extensions have been updated
to accommodate for API changes etc. ``buster-static`` will likely
not be included with 1.0, but installable as an add-on.

Buster.JS 1.1
=============

A revamped ``buster-static`` that can do both Node.js and browser tests
from within the browser is included in the default installation. 

Installers for OS X and Windows.

``buster-ci`` a new binary that can automate everything - start
server, capture browsers, run tests, wind down. Headless testing.
See `this thread <http://groups.google.com/group/busterjs-dev/browse_thread/thread/db3e456278b85590>`_
for the current draft, and pitch in your own ideas/requirements.