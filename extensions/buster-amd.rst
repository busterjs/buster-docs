.. _buster-amd:

==========
buster-amd
==========

**Work in progress**. ``buster-amd`` is an extension that will allow AMD 
projects to use Buster.JS without any specific configuration. It modifies 
the load path of the ``resourceSet`` used to represent user files 
and creates an anonymous AMD module that depends on all tests, thus loading 
files using an AMD loader rather than simple script tags. Currently developed
by `Joakim Ohlrogge <https://github.com/johlrogge/buster-amd>`_.

* Status: In development
* `Source code <https://github.com/johlrogge/buster-amd>`_