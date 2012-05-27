.. highlight:: text

====================================
Setting up a development environment
====================================


First time setup
================

If you don't already have `Node.js <http://nodejs.org/>`_ installed, install it
on your system.  The same goes for `Git <http://git-scm.com/>`_.

For Windows we recommend
`mysysgit <http://code.google.com/p/msysgit/downloads/list>`_ and
`TortoiseGit <http://code.google.com/p/tortoisegit>`_.

The development environment is managed with a CLI, ``buster-dev-tools``. To
bootstrap, you create a folder of your choice, e.g. ``myBusterDevEnv``, to hold
all the packages, and inside get a clone of ``buster-dev-tools`` from GitHub::

    mkdir myBusterDevEnv
    cd myBusterDevEnv
    git clone https://github.com/busterjs/buster-dev-tools.git

Now you need to set some environment variables. ``{path to devEnv}`` is the
absolute path to the folder where you just ran ``git clone``.

On Linux and Mac OS X::

    export NODE_PATH=<kbd>{path to devEnv}</kbd>
    export PATH=$NODE_PATH/buster-dev-tools/bin:$PATH
    export PATH=$NODE_PATH/buster/bin:$PATH

On Windows::

    SET NODE_PATH=<kbd>{path to devEnv}</kbd>
    SET PATH=%NODE_PATH%\buster-dev-tools\bin;%PATH%
    SET PATH=%NODE_PATH%\buster\bin;%PATH%

Now you run the tool to get all the buster packages plus external
dependencies::

    buster-dev-tools pull


Refreshing all repositories
===========================

After some time you might want to update all the repos, including
`buster-dev-tools` itself. To do so, simply repeat the ``pull`` command above.


Migrating from an older development environment
===============================================

Previously, `buster-dev-tools` was also available as an npm package. This is
not any longer supported.  If you've been using this, make sure to first
uninstall it::

    npm uninstall -g buster-dev-tools

Then do a first time setup as above.
