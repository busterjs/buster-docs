.. default-domain:: js
.. highlight:: javascript

.. _buster-format:

=============
buster-format
=============

Version:
    0.4.0 (2011-08-10)

Module:
    ``var format = require("buster-format");``

In browsers:
    ``var format = buster.format;``

Utility functions with helpers for pretty formatting of arbitrary JavaScript
values. Currently only supports ascii formatting, suitable for command-line
utilities. Like `JSON.stringify <https://developer.mozilla.org/en/json>`_, it
formats objects recursively, but unlike ``JSON.stringify``, it can handle
regular expressions, functions and more.


Methods
=======

.. function:: format.ascii(object)

    :func:`format.ascii` can take any JavaScript object, including DOM
    elements, and format it nicely as plain text. It uses the helper functions
    described below to format different types of objects.

    **Simple object**

    ::

        var format = require("buster-format");

        var object = {
            name: "Christian"
        };

        console.log(format.ascii(object));

        // Outputs:
        // { name: "Christian" }

    **Complex object**

    ::

        var format = require("buster-format");

        var developer = {
            name: "Christian",
            interests: ["Programming", "Guitar", "TV"],

            location: {
                language: "Norway",
                city: "Oslo",

                getLatLon: function getLatLon(callback) {
                    // ...
                },

                distanceTo: function distanceTo(location) {
                }
            },

            speak: function () {
                return "Oh hi!";
            }
        };

        console.log(format.ascii(developer));

        // Outputs:
        // {
        //   interests: ["Programming", "Guitar", "TV"],
        //   location: {
        //     city: "Oslo",
        //     distanceTo: function distanceTo() {},
        //     getLatLon: function getLatLon() {},
        //     language: "Norway"
        //   },
        //   name: "Christian",
        //   speak: function () {}
        // }

    **Custom constructor**

    If the object to format is not a generic ``Object`` object,
    **buster-format** displays the type of object (i.e. name of constructor).
    Set the :attr:`format.excludeConstructors` property to control what
    constructors to include in formatted output.

    ::

        var format = require("buster-format");

        function Person(name) {
            this.name = name;
        }

        var dude = new Person("Dude");
        console.log(format.ascii(dude));

        // Outputs:
        // [Person] { name: "Dude" }

    **DOM elements**

    DOM elements are formatted as abbreviated HTML source. 20 characters of
    ``innerHTML`` is included, and if the content is longer, it is truncated
    with ``"[...]"``. Future editions will add the possibility to format nested
    markup structures.

    ::

        var p = document.createElement("p");
        p.id = "sample";
        p.className = "notice";
        p.setAttribute("data-custom", "42");
        p.innerHTML = "Hey there, here's some text for ya there buddy";

        console.log(buster.format.ascii(p));

        // Outputs
        // <p id="sample" class="notice" data-custom="42">Hey there, here's so[...]</p>

.. function:: format.ascii.functionName(func)

    Guesses a function's name. If the function defines the ``displayName``
    property (used by `some debugging tools
    <http://trac.webkit.org/changeset/42478>`_) it is preferred. If it is not
    found, the ``name`` property is tried. If no name can be found this way, an
    attempt is made to find the function name by looking at the function's
    ``toString()`` representation.

.. function:: format.ascii.func(func)

    Formats a function like ``"function [name]() {}"``. The name is retrieved
    from :func:`format.ascii.functionName`.

.. function:: format.ascii.array(array)

    Formats an array as ``"[item1, item2, item3]"`` where each item is
    formatted with :func:`format.ascii`.  Circular references are represented
    in the resulting string as ``"[Circular]"``.

.. function:: format.ascii.object(object)

    Formats all properties of the object with :func:`format.ascii`. If the
    object can be fully represented in 80 characters, it's formatted in one
    line. Otherwise, it's nicely indented over as many lines as necessary.
    Circular references are represented by ``"[Circular]"``.

    Objects created with custom constructors will be formatted as
    ``"[ConstructorName] { ... }"``. Set the :attr:`format.excludeConstructors`
    property to control what constructors are included in the output like this.

.. function:: format.ascii.element(element)

    Formats a DOM element as HTML source. The tag name is represented in
    lower-case and all attributes and their values are included. The element's
    content is included, up to 20 characters. If the length exceeds 20
    characters, it's truncated with a ``"[...]"``.

.. function:: format.ascii.constructorName(object)

    Attempts to guess the name of the constructor that created the object. It
    does so by getting the name of ``object.constructor`` using
    :func:`format.ascii.functionName`. If a name is found,
    :attr:`format.excludeConstructors` is consulted. If the constructor name
    matches any of these elements, an empty string is returned, otherwise the
    name is returned.


Properties
==========

.. attribute:: format.quoteStrings

    Default: ``true``

    Whether or not to quote simple strings. When set to ``false``, simple
    strings are not quoted. Strings in arrays and objects will still be quoted,
    but ``ascii("Some string")`` will not gain additional quotes.

.. attribute:: format.excludeConstructors

    Default: ``["Object", /^.$/]``

    An array of strings and/or regular expressions naming constructors that
    should be stripped from the formatted output. The default value skips
    objects created by ``Object`` and constructors that have one character
    names (which are typically used in ``Object.create`` shims).

    While you can set this property directly on ``format.ascii``, it is
    recommended to create an instance of ``format.ascii`` and override the
    property on that object.

    **Strings** represent constructor names that should not be represented in
    the formatted output. **Regular expressions** are tested against
    constructor names when formatting. If the expression is a match, the
    constructor name is not included in the formatted output.

    ::

        function Person(name) {
            this.name = name;
        }

        var person = new Person("Chris");

        console.log(buster.format.ascii(person));

        // Outputs
        // [Person] { name: "Chris" }

        var formatter = Object.create(buster.format);
        formatter.excludeConstructors = ["Object", /^.$/, "Person"];
        console.log(formatter.ascii(person));

        // Outputs
        // { name: "Chris" }

        // Global overwrite, generally not recommended
        buster.format.excludeConstructors = ["Object", /^.$/, "Person"];
        console.log(buster.format.ascii(person));

        // Outputs
        // { name: "Chris" }
