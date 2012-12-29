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
`TortoiseGit <http://code.google.com/p/tortoisegit>`_. These will also get you
the so-called "Git Bash" which is (almost) a Unix shell on your Windows system.
It's invoked by a right-click to bring up the context menu and then selecting "Git Bash" from that.

The development environment is managed with a CLI (Command Line Interface), ``buster-dev-tools``.
To bootstrap, you create a folder of your choice, e.g. ``busterDevEnv``, to hold
all the packages. Inside of that you clone ``buster-dev-tools`` from GitHub::

    mkdir busterDevEnv
    cd busterDevEnv
    git clone https://github.com/busterjs/buster-dev-tools.git

Note: the name ``busterDevEnv`` is the only thing that you might want to change to your liking.
Everything else can (and should be) copied&pasted as is.

Next, two environment variables need to be adjusted: ``NODE_PATH`` and ``PATH``.
The former, ``NODE_PATH``, affects where Node.js is looking for packages, 
and we want it to do so in the development environment (``busterDevEnv`` in this example).
However, since ``NODE_PATH`` is pretty central to Node.js, we're going to be a bit paranoid
and first push its current value onto ``NODE_PATH_OLD``,
in a stack-like manner (`LIFO <http://en.wikipedia.org/wiki/LIFO_(computing)>`_).

On Linux and Mac OS X (or in Git Bash on Windows)::

    export NODE_PATH_OLD=$NODE_PATH:$NODE_PATH_OLD
    export NODE_PATH=`pwd`
    export PATH=$NODE_PATH/buster-dev-tools/bin:$PATH
    export PATH=$NODE_PATH/buster/bin:$PATH

On Windows (DOS-box)::

    SET NODE_PATH_OLD=%NODE_PATH%;%NODE_PATH_OLD%
    SET NODE_PATH=%CD%
    SET PATH=%NODE_PATH%\buster-dev-tools\bin;%PATH%
    SET PATH=%NODE_PATH%\buster\bin;%PATH%

Please note that the above commands must be *executed right within your development environment folder*,
i.e. assuming you did not "cd" anywhere else after the ``git clone`` from the first step.
Or, put more simply: if you, as advised, just kept copying & pasting - you need not worry :).

Finally you run the tool to get all the buster packages plus external
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
