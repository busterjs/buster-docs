Buster.JS documentation
=======================

This is the sources for the Buster.JS documentation web site at
http://docs.busterjs.org/.


Working with the docs
---------------------

To work with the documentation, simply install `Sphinx
<http://sphinx.pocoo.org/>`_, clone the repo, and build the docs::

    easy_install pip    # If you don't already have the pip Python installer
    pip install sphinx
    git clone https://github.com/busterjs/buster-docs.git
    cd buster-docs
    make html           # Or ``make.bat html`` if you're on Windows

Now you can open ``_build/html/index.html`` in a browser to view the generated
HTML site. Rerun ``make html`` to refresh the generated files.

The docs at http://docs.busterjs.org/ are automatically updated when the
changes are pushed to GitHub, thanks to `Read The Docs
<http://www.readthedocs.org/>`_.


Contributing documentation
--------------------------

Please feel free to add documentation, fix spelling errors or whatever. To
contribute back, do a pull request, or simply send us a patch on
busterjs-dev@googlegroups.com. We're happy to accept your changes in any
medium, as long as it's git commits.
