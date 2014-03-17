=================================================
Useful information around the development process
=================================================


.. _run-buster:

Run Buster.JS
=============

To run a manual test open a new terminal, change to your development directory of
Buster.JS, execute the shell script (or batch file) to set the ``PATH`` and ``NODE_PATH``,
change to the directory of the example project and run the test, for example
just by ``buster-test``, depending on which tests and what kind of tests (browser or node)
you want to run and how you want them to run (for example ``buster-static`` for browser tests).

.. important::

    Before you run Buster.JS, you should run ``buster-dev-tools clear`` and then
    ``buster-dev-tools deps``. The first command deletes the ``node_modules``
    folder of all projects (except for project ``buster-dev-tools``). The second
    one installs the non-buster dependencies for all projects. That way you get
    back the state you have had right after setting up the development environment,
    concerning to the dependencies. Your changes to the source code are still there,
    of course.
    
    This approach is especially important for the final manual test you make,
    just before you commit your changes.


.. _run-tests:

Run tests
=========

During the setup of the development environment via ``buster-dev-tools pull``
only the dependencies specified under ``dependencies`` in the ``package.json``
file are installed, not the ``devDependencies`` and not the ``optionalDependencies``.
They are not needed to run Buster.JS, but to run the tests. Therefore they have
to be installed first. You can do this by changing to the root directory of the
project you want to run the tests for and typing ``npm install``.

.. tip::

    The installation of the ``devDependencies`` can lead to problems, if a package
    has to be compiled, but you haven't established a build toolchain for
    `node-gyp <https://github.com/TooTallNate/node-gyp>`_. Read the
    `installation <https://github.com/TooTallNate/node-gyp#installation>`_
    chapter of `node-gyp <https://github.com/TooTallNate/node-gyp>`_ to learn
    more about this.
    
    If you get the message `Error: spawn ENOENT` for the step `node-gyp configure`,
    try to set the paths for python as follows:
    
    ::
    
        PYTHONPATH=C:\Python27
        PYTHON=%PYTHONPATH%\python.exe
        
    ``PYTHONPATH`` must point to your actual installation directory of Python 2.7.x,
    of course.


To run the tests type ``npm test`` in the root directory of the project.

.. important::

    You shouldn't run the tests in an environment, where you have adjusted
    ``NODE_PATH`` and ``PATH`` for development as described :ref:`here <set-env>`.
    There are two main reasons for that:
    
     1. Most of the projects use Buster.JS (or parts of it) for testing,
        which means, Buster.JS (or parts of it) will be installed
        in the ``node_modules`` directory of the project. Having ``NODE_PATH``
        and ``PATH`` adjusted for development could lead to weird behaviour,
        because both versions of Buster.JS (or parts of it) are mixed up together.
     2. Running the test without adjusting ``NODE_PATH`` and ``PATH`` corresponds
        to how the tests run on `Travis CI <https://travis-ci.org/>`_.


Debugging
=========

A comfortable way to debug Node applications is to use ``node-inspector``.
If you haven't it installed yet, install it by::

    npm install -g node-inspector

Open a terminal and start the inspector::

    node-inspector


Debugging a Buster.JS run
-------------------------

Open the file ``buster/bin/buster-test`` and change the first line from ``#!/usr/bin/env node``
to ``#!/usr/bin/node --debug-brk``.

Open another terminal, change to your development directory of Buster.JS, run the shell script
(or batch file) to set the ``PATH`` and ``NODE_PATH``, change to the example project and run 
the test by ``buster-test``. The execution will be halted at the first instruction and you will
get the info "debugger listening on port 5858", the same as for debugging an automated test run.
From that point on there is no difference between debugging an automated and a manual test run.

.. note::

    If you want to run other command than ``buster-test``, for example ``buster-static``,
    you have to edit the corresponding file instead.


Debugging a test run
--------------------

To debug a test run just run ``npm run-script test-debug`` in the
root directory of the project.
The execution will be halted at the first instruction and you will get the
info `debugger listening on port 5858`.

Open a Chrome browser, go to `http://127.0.0.1:8080/debug?port5858` and you are
ready to debug. More information about debugging with node-inspector can be found at
`node-inspector <https://github.com/node-inspector/node-inspector>`_.


How to get your changes to the Buster.JS repositories
=====================================================

Because you don't have write permission to the Buster.JS repositories you have to push your
changes to a forked repository first and to create a pull request. One of the owner of the project
will merge your changes into the corresponding Buster.JS repository at a later point, if we decide
they are useful for the application.

This is one possible workflow:

#. Create a fork of the repository you want to edit by clicking the "Fork" button on github.
#. Open a terminal and change to the project you want to edit
#. Type ``git remote -v`` and you should see something like this::

    origin	https://github.com/busterjs/buster-cli.git (fetch)
    origin	https://github.com/busterjs/buster-cli.git (push)
    
   This output is for the ``buster-cli`` repository and means, that we currently have only
   one remote directory connected to it and therefore can only fetch changes from there
   and can push our changes only to that repository, but unfortunately we don't have write permission
   for it.

#. Type ``git remote add fork https://github.com/<your_github_username>/<name_of_repository>.git``

   .. tip:: If you open the forked repository on your Github account you will find the Url next to it.
            You can copy and paste it to prevent mistyping.

#. Type ``git remote -v`` again and this time you should see something like this::

    fork	https://github.com/<your_github_username>/buster-cli.git (fetch)
    fork	https://github.com/<your_github_username>/buster-cli.git (push)
    origin	https://github.com/busterjs/buster-cli.git (fetch)
    origin	https://github.com/busterjs/buster-cli.git (push)

#. Now you can specify to which remote repository you want to push your changes. 
   Type ``git push fork master`` to push the changes to the master branch of the
   forked repository.

#. Go to the forked repository on your Github account and press the "Compare and review" button
   to verify your changes and to create a pull request.


Finding your way around the code
================================

We know that it's hard to navigate the source code of Buster.JS if you are new at the project,
because of the amount of projects/repositories. But hold on and don't give up and you will see soon,
that it's not that complicated. A good point to start is to have a look at the `Architecture overview
<http://docs.busterjs.org/en/latest/developers/architecture/>`_, especially at the `example
<http://docs.busterjs.org/en/latest/developers/architecture/#by-example-buster-test-browser>`_.
