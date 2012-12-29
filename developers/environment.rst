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
It's invoked by right-clicking and selecting "Git Bash" from the context menu.

The development environment is managed with a CLI (Command Line Interface), ``buster-dev-tools``.
To bootstrap, you create a folder of your choice, e.g. ``myBusterDevEnv``, to hold
all the packages, and inside get a clone of ``buster-dev-tools`` from GitHub::

    mkdir myBusterDevEnv
    cd myBusterDevEnv
    git clone https://github.com/busterjs/buster-dev-tools.git

Next, two environment variables need to be adjusted: ``NODE_PATH`` and ``PATH``.
The former, ``NODE_PATH``, affects where Node.js is looking for packages; 
it should do so in your development environment (``myBusterDevEnv`` in this example).
Since ``NODE_PATH`` is pretty central to Node.js we're going to be a bit paranoid
and push its current value onto ``NODE_PATH_OLD``, in a stack-like manner (LIFO).
Please note that the following must be executed right within your development environment folder,
i.e. assuming you did not "cd" anywhere else after the ``git clone`` above.

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
