.. default-domain:: js
.. highlight:: javascript
.. _prefsink:

========
prefsink
========

Version:
    0.2.0 (2012-05-07)
Module:
    ``require("prefsink");``

Manage user-provided preferences for your Node programs through a file in
the user's home directory, environment variables and default values.

::

    var prefsink = require("prefsink");

    // Assume ~/.buster contains
    // module.exports = {
    //     reporter: "specification"
    // };

    prefsink.load("buster", function (err, prefs) {
        if (err) { throw err; }

        prefs.get("reporter", "dots"); //=> "specification"
        prefs.get("logLevel", "warn"); //=> "warn"
        process.env.BUSTER_LOG_LEVEL = "info"
        prefs.get("logLevel", "warn"); //=> "info"
    });


Preference modules
==================

::

    prefsink.load("myproject", function (err, prefs) {
        /* ... */
    });

Prefsink will use the first available of the following files (``~/`` denotes
'home directory', which on Windows means the directory specified by
``USERPROFILE``):

#. ``~/.myproject.d/index.js`` (lets the user organize all related files in one
   directory)

#. ``~/.myproject.js`` (the suffix may be useful for editor syntax highlighting
   etc)

#. ``~/.myproject`` (iconic Unix style preference file)

Prefsink expects the settings file to be a node module that can be
``require``'d.

If you want Prefsink to look for other files, or with a different ordering,
just set ``prefsink.locations`` to an array of desired paths. The array should
contain full paths, optionally with ``"{namespace}"`` which will be replaced
with the namespace.


Preference property lookup
==========================

::

    prefs.get("id", 42);

Given one of those modules, Prefsink uses the following property lookup:

#. Does the preference module export ``id``? Use that

#. Is ``process.env.MYPROJECT_ID`` set? Use that

#. Otherwise, use the default (``42`` in the above example)


Properties
==========

.. attribute:: prefsink.home

    String, contains the path to where Prefsink thinks the user's home
    directory is.

.. attribute:: prefsink.locations

    Array of strings. The locations Prefsink will attempt to load, in preferred
    order. Default value is::

        exports.locations = [
            Path.join(exports.home, ".{namespace}.d", "index.js"),
            Path.join(exports.home, ".{namespace}.js"),
            Path.join(exports.home, ".{namespace}")
        ];


Methods
=======

.. function:: prefsink.findFile

    ::

        prefsink.findFile(namespace, callback(err, fileName));

    Finds the filename for the preferred preference module according to the
    lookup described above. Yields ``null`` if none of the files are available.
    The error object is currently not being used as any error will simply
    result in a ``null`` file name.


.. function:: prefsink.findFileSync

    ::

        prefsink.findFileSync(namespace);

    Blocking version of ``findFile``.


.. function:: prefsink.create

    ::

        var prefsJar = prefsink.create(namespace[, prefs[, source]]);

    Creates a preference "jar" (see API below).

    ``namespace``:
        A string, typically the name of your project, like "buster". It will be
        used to find environment variables relevant to your preferences.

    ``prefs``:
        An object with properties. When asking the preference jar for
        properties, properties on this object will be preferred.

    ``source``:
        A string that reveals which source ``prefs`` were loaded from. It's
        simply exposed as ``prefsJar.source``.


.. function:: prefsink.load

    ::

        prefsink.load(namespace, callback(err, prefsJar));

    Figures out which file to use, loads its contents and creates a preference
    jar that is passed to the callback. The error object is used when
    ``require``-ing the preference file fails (i.e. when the file exists but is
    not loadable).


.. function:: prefsink.loadSync

    ::

        prefsink.loadSync(namespace);

    Blocking version of ``load``.


Preference jar
--------------

.. attribute:: prefJar.namespace

    The corresponding string passed in as argument to ``create``

.. attribute:: prefJar.source

    The corresponding string passed in as argument to ``create``

.. function:: prefJar.get

    ::

        prefJar.get(name[, defaultVal]);

    Returns the named property according to the property lookup described
    above. Dashes and spaces are converted to underscores when trying
    environment variables, e.g. ``get("something-nice")`` will try the
    environment variable ``MYPROJECT_SOMETHING_NICE``. Camel cased properties
    will map to underscored and upper cased environment variables.
