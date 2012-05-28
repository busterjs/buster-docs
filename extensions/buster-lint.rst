.. _buster-lint:

===========
buster-lint
===========

``buster-lint`` is an extension that enables the integration of
`JSLint <http://www.jslint.com/>`_ and `JSHint <http://www.jshint.com/>`_ by
way of `autolint <https://github.com/magnars/autolint>`_. Using the
``buster-analyzer`` module, the lint extension is able to flag lint errors as
"error" in buster. This allows the end-user to choose if lint errors should
only be printed as warnings, or actually fail the build (which can be achieved
with ``buster test -F error``). Currently developed by
`Magnar Sveen <https://github.com/magnars/buster-lint>`_.

* Status: Stable, but relies on buster-analyzer
* `Source code <https://github.com/magnars/buster-lint>`_.