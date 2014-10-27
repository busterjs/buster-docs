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
    npm install

Note: the name ``busterDevEnv`` is the only thing that you might want to change to your liking.
Everything else can (and should be) copied&pasted as is.

.. _set-env:

Next, two environment variables need to be adjusted: ``NODE_PATH`` and ``PATH``.
The former, ``NODE_PATH``, affects where Node.js is looking for packages, 
and we want it to do so in the development environment (``busterDevEnv`` in this example).

On Linux and Mac OS X (or in Git Bash on Windows)::

    export NODE_PATH=`pwd`
    export PATH=$NODE_PATH/buster-dev-tools/bin:$PATH
    export PATH=$NODE_PATH/buster/bin:$PATH

.. tip::

    Put the ``export`` statements into a shell script in the ``busterDevEnv`` directory,
    for example ``busterEnv.sh``::

        #!/bin/sh
        
        export NODE_PATH=`pwd`
        export PATH=$NODE_PATH/buster-dev-tools/bin:$PATH
        export PATH=$NODE_PATH/buster/bin:$PATH
        exec bash

    Then make the shell script executable by ``chmod u+x busterEnv.sh``.
    From now on you only have to open a terminal and execute the shell script in the
    ``busterDevEnv`` directory to make that terminal ready for work.
    You can omit the line ``exec bash``, if you execute the script either with
    ``. busterEnv.sh`` or ``source busterEnv.sh``.


On Windows (DOS-box)::

    SET NODE_PATH=%CD%
    SET PATH=%NODE_PATH%\buster-dev-tools\bin;%PATH%

.. tip::

    Put the ``SET`` statements into a batch file in the ``busterDevEnv`` directory,
    for example ``busterEnv.bat``. Then you only need to execute it in a command shell
    in the ``busterDevEnv`` directory to make that command shell ready for work.

Finally you run the tool to get all the buster packages plus external
dependencies::

    buster-dev-tools pull


Refreshing all repositories
===========================

After some time you might want to update all the repos, including
`buster-dev-tools` itself. To do so, simply repeat the ``pull`` command above.
