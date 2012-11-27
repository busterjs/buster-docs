.. default-domain:: js
.. highlight:: javascript
.. _buster-test-options:

============
Test options
============

Version:
    See :ref:`buster-test`


The command :program:`buster test` accepts the following options:

.. program:: buster test

.. option:: -h, --help

    Show usage help. See also ``--help reporters``.

.. option:: -l, --log-level

    Set logging level. One of error, warn, log, info, debug.

.. option:: -v, --verbose

    Increase verbosity level. Include one (log level ``info``) or two times
    (e.g. ``-vv``, for log level ``debug``).

.. option:: -c, --config

    Test configuration file.

.. option:: -g, --config-group

    Test configuration group(s) to load.

.. option:: -t, --tests

    Test files (within active configuration) to run.

.. option:: -e, --environment

    Test configuration environment to load.

.. option:: -r, --reporter

    Test output reporter Default is dots.

.. option:: -C, --color

    Output color scheme. One of ``dim``, ``bright``, ``none``. Default is
    ``bright``.

.. option:: -s, --server

    Hostname and port to a running buster-server instance (for browser tests). Default is ``http://localhost:1111``.

.. option:: -R, --reset

    Don't use cached resources on the server.

.. option:: -W, --warnings

    Warnings to print. One of ``fatal``, ``error``, ``warning``, ``all``,
    ``none``. Default is ``all``.

.. option:: -F, --fail-on

    Fail on warnings at this level. One of ``fatal``, ``error``, ``warning``.
    Default is ``fatal``.

.. option:: -L, --log-all

    Log all messages, including for passed tests.

.. option:: -o, --release-console

    By default, Buster captures log messages from :func:`console.log` and
    friends. It does so by replacing the global :attr:`console` object with the
    :attr:`buster.console` object. This option skips this hijacking.

.. option:: -p, --static-paths

    Serve files over a static URL on the server. Reusing paths across test runs
    makes it possible to use breakpoints, but increases the risk of stale
    resources due to due to the browser caching too eagerly.
