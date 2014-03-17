=======================
Contribution guidelines
=======================


Post questions to the busterjs-dev mailing list
===============================================

The `busterjs-dev mailing list <http://groups.google.com/group/busterjs-dev>`_
is a place for general discussion regarding development of Buster.JS. In many
cases you can just post an issue to `the issue tracker
<https://github.com/busterjs/buster/issues>`_  and the discussion can happen
there. But you can also discuss on the mailing list if you're more comfortable
with that. For example, you might prefer to use email for discussion, or you
want to discuss your contribution before posting it to the issue tracker.


Coding style
============

Use your favorite IDE to edit files, but please always use `autolint
<https://github.com/magnars/autolint>`_. If you don't have installed it yet,
you can do that by::

    npm install -g autolint

Before you edit a file, run ``autolint`` in the root directory of the related
project. Keep an eye on the output of the tool while you are editing and fix all
mentioned issues before you commit your changes.

Further it's a good idea to look at existing code to get an idea of the
coding style of the project.


Automated tests
===============

It is important that you write good unit tests for your changes.
Best way to do that is to develop test-driven. We are convinced test-driven
developer and we would be very pleased, if you're one too.

:ref:`How to run tests <run-tests>`


Manual testing
==============

To verify that your changes also work in the real life, besides the automated
test world, you have to test them manually. It's useful to have an example project
for that. If you want to fix an issue it is recommened to create an example project
to reproduce the issue first. Later you can use the same project to verify
the issue is really fixed.

:ref:`How to run Buster.JS <run-buster>`


Understanding Buster.JS
=======================

See :doc:`architecture`.
