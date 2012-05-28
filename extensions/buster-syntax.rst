.. _buster-syntax:

=============
buster-syntax
=============

``buster-syntax`` is a small extension that provides server-side syntax
checking of scripts sent for testing with buster-capture-server. When
Buster.JS loads scripts in browsers, the browser in question will be the one
responsible for the level of detail when errors arise, Syntax checking on the
server allows us to catch these errors in one place, and produce a pretty nice
report, regardless of browser intended to run the tests.

* Status: Stable, but integrates with ``buster-analyzer``
* `Source code <https://github.com/busterjs/buster-analyzer>`_