Buster.JS documentation -- Sphinx edition
=========================================

This is the source for http://busterjs.readthedocs.org/, which maybe will
become the new http://busterjs.org/.

We'll see how Sphinx works out for the Buster.JS docs, and make a decision
later.


Working with the docs
---------------------

To work with the documentation, simply install Sphinx, clone the repo, and
build the docs::

    easy_install pip    # If you don't already have the pip Python installer
    pip install sphinx
    git clone https://github.com/busterjs/buster-docs-sphinx.git
    cd buster-docs-sphinx
    make html           # Or ``make.bat html`` if you're on Windows

Now you can open ``_build/html/index.html`` in a browser to view the generated
HTML site. Rerun ``make html`` to refresh the generated files.

The docs at http://busterjs.readthedocs.org/ are automatically updated when the
changes are pushed to GitHub.


Contributing documentation
--------------------------

Please feel free to add documentation, fix spelling errors or whatever. To
contribute back, do a pull request, or simply send us a patch on
busterjs-dev@googlegroups.com. We're happy to accept your changes in medium, as
long as it's git commits.
