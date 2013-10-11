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

.. tip::

    Put the ``export`` statements into a shell script in the ``busterDevEnv`` directory,
    for example ``busterEnv.sh``::

        #!/bin/sh
        
        export NODE_PATH_OLD=$NODE_PATH:$NODE_PATH_OLD
        export NODE_PATH=`pwd`
        export PATH=$NODE_PATH/buster-dev-tools/bin:$PATH
        export PATH=$NODE_PATH/buster/bin:$PATH
        exec bash

    Then make the shell script executable by ``chmod u+x busterEnv.sh``.
    From now on you only have to open a terminal and execute the shell script in the
    ``busterDevEnv`` directory to make that terminal ready for work.


On Windows (DOS-box)::

    SET NODE_PATH_OLD=%NODE_PATH%;%NODE_PATH_OLD%
    SET NODE_PATH=%CD%
    SET PATH=%NODE_PATH%\buster-dev-tools\bin;%PATH%
    SET PATH=%NODE_PATH%\buster\bin;%PATH%

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


Editing files
=============

Use your favorite IDE to edit files, but please always use `autolint
<https://github.com/magnars/autolint>`_. If you don't have installed it yet,
you can do that by::

    npm install -g autolint

Before you edit a file, run ``autolint`` in the root directory of the related
project. Keep an eye on the output of the tool while you are editing and fix all
mentioned issues before you commit your changes.


Automated tests
===============

It is important that you write good unit tests for your changes.
Best way to do that is to develop test-driven. We are convinced test-driven
developer and we would be very pleased, if you're one too.

You can run all tests of a project by ``node run-tests.js`` or ``npm test``
in the root directory of the project.


Manual testing
==============

To verify that your changes also work in the real life, besides the automated
test world, you have to test them manually. It's useful to have an example project
for that. If you want to fix an issue it is recommened to create an example project
to reproduce the issue first. Later you can use the same project to verify
the issue is really fixed.

To run a manual test open a new terminal, change to your development directory of
Buster.JS, execute the shell script (or batch file) to set the ``PATH`` and ``NODE_PATH``,
change to the directory of the example project and run the test, for example
just by ``buster-test``, depending on which tests and what kind of tests (browser or node)
you want to run and how you want them to run (for example ``buster-static`` for browser tests).

.. important::

    You should definetly avoid to have a global installation of Buster.JS, if you
    want to run Buster.JS from the development environment. Otherwise chances are
    high that it will be involved in the test run and therefore influence the run.


Debugging
=========

A comfortable way to debug node applications is to use ``node-inspector``.
If you haven't it installed yet, install it by::

    npm install -g node-inspector

Open a terminal and start the inspector::

    node-inspector


Debugging an automated test run
-------------------------------

To debug an automated test run just run ``node --debug-brk run-tests.js``.
The execution will be halted at the first instruction and you will get the
info `debugger listening on port 5858`.

Open a chrome browser, go to `http://127.0.0.1:8080/debug?port5858` and you are
ready to debug. More information about debugging with node-inspector can be found at
`node-inspector <https://github.com/node-inspector/node-inspector>`_.


Debugging a manual test run on Linux
------------------------------------

Open the file `/buster/bin/buster-test` and change the first line from ``#!/usr/bin/env node``
to ``#!/usr/bin/node --debug-brk``.

Open another terminal, change to your development directory of Buster.JS, run the shell script
(or batch file) to set the ``PATH`` and ``NODE_PATH``, change to the example project and run 
the test by ``buster-test``. The execution will be halted at the first instruction and you will
the info `debugger listening on port 5858`, the same as for debugging an automated test run.
From that point on there is no difference between debugging an automated and a manual test run.

.. note::

    If you want to run other command than `buster-test`, for example `buster-static`,
    you have to edit the corresponding file instead.


Debugging a manual test run on Windows
--------------------------------------

Coming soon.


How to get your changes to the Buster.JS repositories
=====================================================

Because you don't have write permission to the Buster.JS repositories you have to push your
changes to a forked repository first and to create a pull request. One of the owner of the project
will merge your changes into the corresponding Buster.JS repository at a later point, if we decide
they are useful for the application.

This is one possible workflow:

#. Create a fork of the repository you want to edit by clicking the `Fork` button on github.
#. Open a terminal and change to the project you want to edit
#. Type ``git remote -v`` and you should see something like this::

    origin	https://github.com/busterjs/buster-cli.git (fetch)
    origin	https://github.com/busterjs/buster-cli.git (push)
    
   This output is for the ``buster-cli`` repository and means, that we currently have only
   one remote directory connected to it and therefore can only fetch changes from there
   and can push our changes only to that repository, but unfortunately we don't have write permission
   for it.

#. Type ``git remote add fork https://github.com/<your_github_username>/<name_of_repository>.git``

   .. tip:: If you open the forked repository on your github account you will find the url next to it.
            You can copy and paste it to prevent mistyping.

#. Type ``git remote -v`` again and this time you should see something like this::

    fork	https://github.com/<your_github_username>/buster-cli.git (fetch)
    fork	https://github.com/<your_github_username>/buster-cli.git (push)
    origin	https://github.com/busterjs/buster-cli.git (fetch)
    origin	https://github.com/busterjs/buster-cli.git (push)

#. Now you can specify to which remote repository you want to push your changes. 
   Type ``git push fork master`` to push the changes to the master branch of the
   forked repository.

#. Go to the forked repository on your github account and press the `Compare and review` button
   to verify your changes and to create a pull request.


How to orientate
================

We know that it's hard to orientate in the source code of Buster.JS if you are new at the project,
because of the amount of projects/repositories. But hold on and don't give up and you will see soon,
that it's not that complicated. A good point to start is to have a look at the `Architecture overview
<http://docs.busterjs.org/en/latest/developers/architecture/>`_, especially at the `example
<http://docs.busterjs.org/en/latest/developers/architecture/#by-example-buster-test-browser>`_.
