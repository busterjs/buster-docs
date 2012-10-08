.. default-domain:: js
.. highlight:: javascript
.. _buster-assertions:

=================
buster-assertions
=================

Version:
    0.10.1 (2012-04-26)
Module:
    ``require("buster-assertions");``
In browsers:
    ``buster.assertions;``

A collection of assertions to be used with a unit testing framework.
**buster-assertions** works well with any CommonJS compliant testing framework
out of the box, and can easily be configured to work with most any testing
framework. See also :ref:`expectations` if you like the alternative API
(``expect(thing).toBe*``).

**buster-assertions** contains lots of assertions. We
strongly believe that high-level assertions are essential in the
interest of producing clear and intent-revealing tests, and they also
give you to-the-point failure messages.


Assertions and refutations
==========================

Unlike most assertion libraries, **buster-assertion** does not have
``assert.notXyz`` assertions to refute some fact. Instead, it has
*refutations*, heavily inspired by Ruby's `minitest
<http://bfts.rubyforge.org/minitest/>`_::

    var assert = buster.assertions.assert;
    var refute = buster.assertions.refute;

    assert.equals(42, 42);
    refute.equals(42, 43);

Refutations help express "assert not ..." style verification in a much clearer
way. It also brings with it a nice consistency in that any ``assert.xyz``
always has a corresponding ``refute.xyz`` that does the opposite check.


Custom assertions
=================

Custom, domain-specific assertions helps improve clarity and reveal intent in
tests. They also facilitate much better feedback when they fail. You can add
custom assertions that behave exactly like the built-in ones (i.e. with
counting, message formatting, expectations and more) by using the :func:`add`
method.


Overriding assertion messages
=============================

The default assertion messages can be overridden. The properties to overwrite
are listed with each assertion along with the arguments the string is fed.
Here's an example of providing a new assertion failure message for
:func:`assert.equals`::

    var assert = buster.assertions.assert;
    assert.equals.message = "I wanted ${0} == ${1}!"

    try {
        assert.equals(3, 4);
    } catch (e) {
        console.log(e.message);
    }

    // Prints:
    // "I wanted 3 == 4!"


Events
======

``buster.assertions`` is an :ref:`event-emitter`. Listen to events with
``on``::

    buster.assertions.on("failure", function (err) {
        console.log(err.message);
    });


``pass`` event
--------------

Signature::

    "pass", function () {}

Assertion passed. The callback is invoked with the assertion name, e.g.
``"equals"``, as its only argument. Note that this event is also emitted when
refutations pass.


``failure`` event
-----------------

Signature::

    "failure", function (error) {}

Assertion failed. The callback is invoked with an :class:`AssertionError`
object.


Assertions
==========

Examples assume that you have aliased ``buster.assertions.assert`` as such::

    var assert = buster.assertions.assert;


.. function:: assert

    ::

        assert(actual[, message]);

    Fails if ``actual`` is falsy (``0``, ``""``, ``null``, ``undefined``,
    ``NaN``). Fails with either the provided message or "Expected null to be
    truthy". This behavior differs from all other assertions, which does not
    allow for the optional message argument.

    ::

        assert({ not: "Falsy" }, "This will pass");
        assert(null, "This will fail"); // Fails with custom message
        assert(null); // Fails
        assert(34);   // Passes


.. function:: assert.same

    ::

        assert.same(actual, expected[, message])``

    Fails if ``actual`` **is not** the same object (``===``) as ``expected``.
    To compare similar objects, such as ``{ name: "Chris", id: 42 }`` and ``{
    id: 42, name: "Chris" }`` (not the same instance), see
    :func:`assert.equals`. The optional message is prepended to the failure
    message if provided.

    ::

        var obj = { id: 42, name: "Chris" };
        assert.same(obj, obj);                       // Passes
        assert.same(obj, { id: 42, name: "Chris" }); // Fails

    **Message**

    ::

        assert.same.message = "${0} expected to be the same object as ${1}";

    ``${0}``:
        The actual object
    ``${1}``:
        The expected object


.. function:: assert.equals

    ::

        assert.equals(actual, expected[, message])

    Compares ``actual`` to ``expected`` property by property. If the property
    count does not match, or if any of ``actual``'s properties does not match
    the corresponding property in ``expected``, the assertion fails. Object
    properties are verified recursively.

    If ``actual`` is ``null`` or ``undefined``, an exact match is required.
    Date objects are compared by their ``getTime`` method. Regular expressions
    are compared by their string representations. Primitives are compared using
    ``==``, i.e., with coercion.

    ``equals`` passes when comparing an ``arguments`` object to an array if the
    both contain the same elements.

    ::

        var assert = assert;
        assert.equals({ name: "Professor Chaos" }, { name: "Professor Chaos" }); // Passes
        assert.equals({ name: "Professor Chaos" }, { name: "Dr Evil" });         // Fails

    **Message**

    ::

        assert.equals.message = "${0} expected to be equal to ${1}";

    ``${0}``:
        The actual object
    ``${1}``:
        The expected object


.. function:: assert.defined

    ::

        assert.defined(object[, message])

    Fails if ``object`` is ``undefined``. The optional message is prepended to
    the failure message if provided.

    ::

        var a;
        assert.defined({});  // Passes
        assert.defined(a); // Fails

    **Message**

    ::

        assert.defined.message = "Expected to be defined";


.. function:: assert.isNull

    ::

        assert.isNull(object[, message])

    Fails if ``object`` is not ``null``. The optional message is prepended to
    the failure message if provided.

    ::

        assert.isNull(null, "This will pass");
        assert.isNull({}, "This will fail");
        assert.isNull(null); // Passes
        assert.isNull({});   // Fails

    **Message**

        assert.isNull.message = "Expected ${0} to be null";

    ``${0}``::
        The actual object


.. function:: assert.match

    ::

        assert.match(actual, matcher[, message])

    Fails if ``matcher`` is not a partial match for ``actual``. Accepts a wide
    range of input combinations.  Note that ``assert.match`` is not symmetric -
    in some cases ``assert.match(a, b)`` may pass while ``assert.match(b, a)``
    fails.

    **String matcher**

    In its simplest form, ``assert.match`` performs a case insensitive
    substring match. When the matcher is a string, the ``actual`` object is
    converted to a string, and the assertion passes if ``actual`` is a
    case-insensitive substring of ``expected`` as a string.

    ::

        assert.match("Give me something", "Give");                           // Passes
        assert.match("Give me something", "sumptn");                         // Fails
        assert.match({ toString: function () { return "yeah"; } }, "Yeah!"); // Passes

    The last example is not symmetric. When the matcher is a string, the actual
    value is coerced to a string - in this case using ``toString``. Changing
    the order of the arguments would cause the matcher to be an object, in
    which case different rules apply (see below).

    **Boolean matcher**

    Performs a strict (i.e. ``===``) match with the object. So, only ``true``
    matches ``true``, and only ``false`` matches ``false``.

    **Regular expression matcher**

    When the matcher is a regular expression, the assertion will pass if
    ``expected.test(actual)`` is true. ``assert.match`` is written in a generic
    way, so any object with a ``test`` method will be used as a matcher this
    way.

    ::

        assert.match("Give me something", /^[a-z\s]$/i); // Passes
        assert.match("Give me something", /[0-9]/); // Fails
        assert.match({ toString: function () { return "yeah!"; } }, /yeah/); // Passes
        assert.match(234, /[a-z]/); // Fails

    **Number matcher**

    When the matcher is a number, the assertion will pass if ``matcher ==
    actual``.

    ::

        assert.match("123", 123); // Passes
        assert.match("Give me something", 425); // Fails
        assert.match({ toString: function () { return "42"; } }, 42); // Passes
        assert.match(234, 1234); // Fails


    **Function matcher**

    When the matcher is a function, it is called with ``actual`` as its only
    argument. The assertion will pass if the function returns ``true``. A
    strict match is performed against the return value, so a boolean ``true``
    is required, truthy is not enough.

    ::

        // Passes
        assert.match("123", function (exp) {
            return exp == "123";
        });

        // Fails
        assert.match("Give me something", function () {
            return "ok";
        });

        // Passes
        assert.match({
            toString: function () {
                return "42";
            }
        }, function () { return true; });

        // Fails
        assert.match(234, function () {});

    **Object matcher**

    As mentioned above, if an object matcher defines a ``test`` method the
    assertion will pass if ``matcher.test(actual)`` returns truthy. If the
    object does not have a ``test`` method, a recursive match is performed. If
    all properties of ``matcher`` matches corresponding properties in
    ``actual``, the assertion passes. Note that the object matcher does not
    care if the number of properties in the two objects are the same - only if
    all properties in the matcher recursively "matches" ones in the actual
    object.

    ::

        // Passes
        assert.match("123", {
            test: function (arg) {
                return arg == 123;
            }
        });

        // Fails
        assert.match({}, { prop: 42 });

        // Passes
        assert.match({
            name: "Chris",
            profession: "Programmer"
        }, {
            name: "Chris"
        });

        // Fails
        assert.match(234, {
            name: "Chris"
        });


    **DOM elements**

    ``assert.match`` can be very helpful when asserting on DOM elements,
    because it allows you to compare several properties with one assertion::

        var el = document.getElementById("myEl");

        assert.match(el, {
            tagName: "h2",
            className: "item",
            innerHTML: "Howdy"
        });

    **Messages**

    ::

        assert.match.exceptionMessage = "${0}";

    Used when the matcher function throws an exception. This happens if the
    matcher is not any of the accepted types, for instance, a boolean.

    ``${0}``
        Message from exception thrown by matcher function.

    ::

        assert.match.message = "${0} expected to match ${1}";

    ``${0}``:
        The actual object
    ``${1}``:
      The expected object


.. function:: assert.isObject

    ::

        assert.isObject(object[, message])

    Fails if ``object`` is not an object or if it is ``null``.

    ::

        assert.isObject({});             // Passes
        assert.isObject(42);             // Fails
        assert.isObject([1, 2, 3]);      // Passes
        assert.isObject(function () {}); // Fails

    **Message**

    ::

        assert.isObject.message = "${0} (${1}) expected to be object and not null";

    ``${0}``:
        The actual object
    ``${1}``:
      ``typeof object``


.. function:: assert.isFunction

    ::

        assert.isFunction(actual[, message])

    Fails if ``actual`` is not a function.

    ::

        assert.isFunction({});             // Fails
        assert.isFunction(42);             // Fails
        assert.isFunction(function () {}); // Passes

    **Message**

    ::

        assert.isFunction.message = "${0} (${1}) expected to be function";

    ``${0}``:
        The actual value
    ``${1}``
        ``typeof actual value``


.. function:: assert.exception

    ::

        assert.exception(callback[, type])

    Fails if ``callback`` does not throw an exception. If the optional ``type``
    is provided, the assertion fails if the callback either does not throw an
    exception, **or** if the exception is not of the given type (determined by
    its ``name`` property).  The optional message is prepended to the failure
    message if provided.

    ::

        // Passes
        assert.exception(function () {
            throw new Error("Ooops!");
        });

        // Fails
        assert.exception(function () {});

        // Passes
        assert.exception(function () {
            throw new TypeError("Ooops!");
        }, "TypeError");

        // Fails, wrong exception type
        assert.exception(function () {
            throw new Error("Aww");
        }, "TypeError");

        // Fails
        assert.exception(function () {}, "TypeError");

    **Messages**

    ::

        assert.exception.typeNoExceptionMessage = "Expected ${0} but no exception was thrown";
        assert.exception.message = "Expected exception";
        assert.exception.typeFailMessage = "Expected ${0} but threw ${1}, (${2})";

    ``${0}``:
        The expected exception type (if provided)
    ``${1}``:
        The type of exception thrown (if any)
    ``${2}``:
        The exception message


.. function:: assert.tagName

    ::

        assert.tagName(element, tagName[, message])

    Fails if the ``element`` either does not specify a ``tagName`` property, or
    if its value is not a case-insensitive match with the expected ``tagName``.
    The optional message is prepended to the failure message if provided.
    Works with any object.

    ::

        assert.tagName(document.createElement("p"), "p"); // Passes
        assert.tagName(document.createElement("h2"), "H2"); // Passes
        assert.tagName(document.createElement("p"), "li");  // Fails

    **Messages**

    ::

        assert.tagName.noTagNameMessage = "Expected ${1} to have tagName property";
        assert.tagName.message = "Expected tagName to be ${0} but was ${1}";

    ``${0}``:
        The expected ``tagName``
    ``${1}``:
        If the object does not have a ``tagName`` property, this is the object.
        Otherwise, it is the value of ``object.tagName``.


.. function:: assert.className

    ::

        assert.className(element, className[, message])

    Fails if the ``element`` either does not specify a ``className`` property,
    or if its value is not a space-separated list of all class names in
    ``classNames``.

    ``classNames`` can be either a space-delimited string or an array of class
    names. Every class specified by ``classNames`` must be found in the
    object's ``className`` property for the assertion to pass, but order does
    not matter.

    ::

        var el = document.createElement("p");
        el.className = "feed item blog-post";

        assert.className(el, "item");           // Passes
        assert.className(el, "news");           // Fails
        assert.className(el, "blog-post feed"); // Passes
        assert.className(el, "feed items");     // Fails, "items" is not a match
        assert.className(el, ["item", "feed"]); // Passes

    **Message**

    ::

        assert.className.noClassNameMessage = "Expected object to have className property";
        assert.className.message = "Expected object's className to include ${0} but was ${1}";

    ``${0}``:
        The expected ``classNames``
    ``${1}``:
        The value of the object's ``className`` property, if any.


.. _stubs-and-spies:

Stubs and spies
---------------

The default Buster.JS bundle comes with built-in spies, stubs and mocks
provided by `Sinon.JS <http://sinonjs.org>`_. The assertions are indisposable
when working with spies and stubs. However, note that these assertions are
technically provided by the integration package :ref:`buster-sinon`, *not*
**buster-assertions**. This only matters if you use this package stand-alone.


.. function:: assert.called

    ::

        assert.called(spy[, message])

    Fails if the spy has never been called.

    ::

        var spy = this.spy();

        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Passes

        spy();
        assert.called(spy); // Passes

    **Message**

    ::

        assert.called.message = "Expected ${0} to be called at least once but was never called";

    ``${0}``:
        The spy


.. function:: assert.callOrder

    ::

        assert.callOrder(spy, spy2, ...)

    Fails if the spies were not called in the specified order.

    ::

        var spy1 = this.spy();
        var spy2 = this.spy();
        var spy3 = this.spy();

        spy1();
        spy2();
        spy3();

        assert.callOrder(spy1, spy3, spy2); // Fails
        assert.callOrder(spy1, spy2, spy3); // Passes

    **Message**

    ::

        assert.callOrder.message = "Expected ${expected} to be called in order but were called as ${actual}";

    ``${expected}``:
        A string representation of the expected call order
    ``${actual}``:
        A string representation of the actual call order


.. function:: assert.calledOnce

    ::

        assert.calledOnce(spy)

    Fails if the spy has never been called or if it was called more than once.

    ::

        var spy = this.spy();

        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Passes

        spy();
        assert.called(spy); // Fails

    **Message**

    ::

        assert.calledOnce.message = "Expected ${0} to be called once but was called ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: assert.calledTwice

    ::

        assert.calledTwice(spy)

    Only passes if the spy was called exactly two times.

    ::

        var spy = this.spy();

        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Passes

        spy();
        assert.called(spy); // Fails

    **Message**

    ::

        assert.calledTwice.message = "Expected ${0} to be called twice but was called ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: assert.calledThrice

    ::

        assert.calledThrice(spy)

    Only passes if the spy has been called exactly three times.

    ::

        var spy = this.spy();

        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Fails

        spy();
        assert.called(spy); // Passes

        spy();
        assert.called(spy); // Fails

    **Message**

    ::

        assert.calledThrice.message = "Expected ${0} to be called thrice but was called ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: assert.calledWith

    ::

        assert.calledWith(spy, arg1, arg2, ...)

    Passes if the spy was called at least once with the specified arguments.
    Other arguments may have been passed after the specified ones.

    ::

        var spy = this.spy();
        var arr = [1, 2, 3];
        spy(12);
        spy(42, 13);
        spy("Hey", arr, 2);

        assert.calledWith(spy, 12);         // Passes
        assert.calledWith(spy, "Hey");      // Passes
        assert.calledWith(spy, "Hey", 12);  // Fails
        assert.calledWith(spy, "Hey", arr); // Passes

    **Message**

    ::
        assert.calledWith.message = "Expected ${0} to be called with arguments ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The expected arguments
    ``${2}``:
        String representation of all calls.


.. function:: assert.calledOnceWith

    ::
        assert.calledOnceWith(spy, arg1, arg2, ...)

    Passes if the spy was called exactly once and with the specified arguments.
    Other arguments may have been passed after the specified ones.

    ::

        var spy = this.spy();
        var arr = [1, 2, 3];
        spy(12);

        assert.calledOnceWith(spy, 12);     // Passes
        assert.calledOnceWith(spy, 42);     // Fails

        spy(42, 13);
        assert.calledOnceWith(spy, 42, 13); // Fails

    **Message**

    ::

        assert.calledOnceWith.message = "Expected ${0} to be called once with arguments ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The expected arguments
    ``${2}``:
        String representation of all calls.


Refutations
===========

Examples assume that you have aliased ``buster.assertions.refute`` as such::

    var refute = buster.assertions.refute;


.. function:: refute

    ::

        refute(actual[, message])

    Fails if ``actual`` is truthy. Fails with either the provided message or
    "Expected null to be falsy". This behavior differs from all other
    refutations, which do not allow for the optional message argument.

    ::

        refute({ not: "Falsy" }, "This will fail"); // Fails with custom message
        refute(null, "This will pass");
        refute(null); // Passes
        refute(34);   // Fails


.. function:: refute.same

    ::

        refute.same(actual, expected[, message])

    Fails if ``actual`` **is** the same object (``===``) as ``expected``. To
    compare similar objects, such as ``{ name: "Chris", id: 42 }`` and ``{ id:
    42, name: "Chris" }`` (not the same instance), see :func:`refute.equals`.
    The optional message is prepended to the failure message if provided.

    ::

        var obj = { id: 42, name: "Chris" };
        refute.same(obj, { id: 42, name: "Chris" }); // Passes
        refute.same(obj, obj);                       // Fails

    **Message**

    ::

        refute.same.message = "${0} expected not to be the same object as ${1}";

    ``${0}``:
        The actual object
    ``${1}``:
        The expected object


.. function:: refute.equals

    ::

        refute.equals(actual, expected[, message])

    Passes in any case where :func:`assert.equals` fails.  The optional message
    is prepended to the failure message if provided.

    ::

        var assert = assert;
        refute.equals({ name: "Professor Chaos" }, { name: "Dr Evil" });         // Passes
        refute.equals({ name: "Professor Chaos" }, { name: "Professor Chaos" }); // Fails

    **Message**

    ::

        refute.equals.message = "${0} expected not to be equal to ${1}";

    ``${0}``:
        The actual object
    ``${1}``:
        The expected object


.. function:: refute.defined

    ::

        refute.defined(object[, message])

    Fails if ``object`` is not ``undefined``. The optional message is prepended
    to the failure message if provided.

    ::

        var a;

        refute.defined(undefined); // Passes
        refute.defined({});        // Fails
        refute.defined(a);         // Passes
        refute.defined({});        // Fails

    **Message**

    ::

        refute.defined.message = "typeof ${0} (${1}) expected to be undefined";

    ``${0}``:
        The actual object
    ``${1}``:
        ``typeof object``


.. function:: refute.isNull

    ::

        refute.isNull(object[, message])

    Fails if ``object`` is ``null``. The optional message is prepended to the
    failure message if provided.

    ::

        refute.isNull({});   // Passes
        refute.isNull(null); // Fails

    **Message**

    ::

        refute.isNull.message = "Expected not to be null";


.. function:: refute.match

    ::

        refute.match(actual, pattern[, message])

    Fails in cases where :func:`assert.match` passes.

    **Messages**

    ::

        refute.match.exceptionMessage = "${0}";

    Used when the matcher function throws an exception. This happens if the
    matcher is not any of the accepted types, for instance, a boolean.

    ``${0}``:
        Message from exception thrown by matcher function.

    ::

        refute.match.message = "${0} expected not to match ${1}";

    ``${0}``:
        The actual objetc
    ``${1}``:
        The expected object


.. function:: refute.isObject

    ::

        refute.isObject(object[, message])

    Fails if ``object`` is a non-null object.

    ::

        refute.isObject({});             // Fails
        refute.isObject(42);             // Passes
        refute.isObject([1, 2, 3]);      // Fails
        refute.isObject(function () {}); // Passes

    **Message**

    ::

        refute.isObject.message = "${0} (${1}) expected not to be object and not null";

    ``${0}``:
        The actual object
    ``${1}``:
        ``typeof object``


.. function:: refute.isFunction

    ::

        refute.isFunction(actual[, message])

    Fails if ``actual`` is a function.

    ::

        refute.isFunction({});             // Passes
        refute.isFunction(42);             // Passes
        refute.isFunction(function () {}); // Fails

    **Message**

    ::

        refute.isFunction.message = "${0} (${1}) expected not to be function";

    ``${0}``:
        The actual value
    ``${1}``:
        ``typeof actual value``


.. function:: refute.exception

    ::

        refute.exception(callback)

    Fails if ``callback`` throws an exception.

    ::

        refute.exception(function () {
            // Exercise code...
        }); // Passes

        refute.exception(function () {
            throw new TypeError("Ooops!");
        }); // Fails

    **Message**

    ::

        refute.exception.message = "Expected not to throw but threw ${0}, (${1})";

    ``${0}``:
        The type of exception thrown (if any)
    ``${1}``:
        The exception message


.. function:: refute.tagName

    ::

        refute.tagName(element, tagName[, message])

    Fails if the ``element`` either does not specify a ``tagName`` property, or
    if its value **is** a case-insensitive match with the expected ``tagName``.
    The optional message is prepended to the failure message if provided.

    ::

        refute.tagName(document.createElement("p"), "LI");  // Passes
        refute.tagName(document.createElement("p"), "p");   // Fails
        refute.tagName(document.createElement("h2"), "H3"); // Passes
        refute.tagName(document.createElement("p"), "p");   // Fails

    **Message**

    ::

        refute.tagName.noTagNameMessage = "Expected ${1} to have tagName property";

    ``${0}``:
        The expected ``tagName``
    ``${1}``:
        If the object does not have a ``tagName`` property, this is the object.


.. function:: refute.className

    ::

        refute.className(element, className[, message])

    Fails if the ``element`` either does not specify a ``className`` property,
    or if its value **is** a space-separated list of all class names in
    ``classNames``.

    ``classNames`` can be either a space-delimited string or an array of class
    names. If any class specified by ``classNames`` is not found in the
    object's ``className`` property the assertion passes. Order does not
    matter.

    ::

        var el = document.createElement("p");
        el.className = "feed item blog-post";

        refute.className(el, "blog-post rss");  // Passes
        refute.className(el, "feed item");      // Fails
        refute.className(el, ["item", "feed"]); // Passes

    **Message**

    ::

        refute.className.noClassNameMessage = "Expected object to have className property";
        refute.className.message = "Expected object's className to not include ${0} but was ${1}";

    ``${0}``:
        The expected ``classNames``
    ``${1}``:
      The value of the object's ``className`` property, if any. Otherwise, the
      object itself.


Stubs and spies
---------------

See :ref:`stubs-and-spies` for explanation. The following are spy/stub related
refutations.


.. function:: refute.called

    ::

        refute.called(spy)

    Passes when spy has never been called.

    ::

        var spy = this.spy();

        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Fails

    **Message**

    ::

        refute.called.message = "Expected ${0} to not be called but was called ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls as a string. Ex: "two times".
    ``${2}``:
        All calls formatted as a multi-line string.


.. function:: refute.callOrder

    ::

        refute.callOrder(spy, spy2, ...)

    Passes where :func:`assert.callOrder` fails.

    **Message**

    ::

        refute.callOrder.message = "Expected ${expected} not to be called in order";

    ``${expected}``:
        A string representation of the expected call order


.. function:: refute.calledOnce

    ::

        refute.calledOnce(spy)

    Fails if the spy was called exactly once.

    ::

        var spy = this.spy();

        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Fails

        spy();
        refute.called(spy); // Passes

    **Message**

    ::

        refute.calledOnce.message = "Expected ${0} to not be called exactly once${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: refute.calledTwice

    ::

        refute.calledTwice(spy)

    Fails if the spy was called exactly twice.

    ::

        var spy = this.spy();

        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Fails

        spy();
        refute.called(spy); // Passes

    **Message**

    ::

        refute.calledTwice.message = "Expected ${0} to not be called exactly twice${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: refute.calledThrice

    ::

        refute.calledThrice(spy)

    Fails if the spy was called exactly three times.

    ::

        var spy = this.spy();
        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Passes

        spy();
        refute.called(spy); // Fails

        spy();
        refute.called(spy); // Passes

    **Message**

    ::

        refute.calledThrice.message = "Expected ${0} to not be called exactly thrice${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The number of calls, as a string. Ex: "two times"
    ``${2}``:
        The call log. All calls as a string. Each line is one call and includes
        passed arguments, returned value and more.


.. function:: refute.calledWith

    ::

        refute.calledWith(spy, arg1, arg2, ...)

    Fails if the spy was called at least once with the specified arguments.

    ::

        var spy = this.spy();
        var arr = [1, 2, 3];
        spy(12);
        spy(42, 13);
        spy("Hey", arr, 2);

        refute.calledWith(spy, 12);         // Fails
        refute.calledWith(spy, "Hey");      // Fails
        refute.calledWith(spy, "Hey", 12);  // Passes
        refute.calledWith(spy, "Hey", arr); // Fails

    **Message**

    ::

        refute.calledWith.message = "Expected ${0} not to be called with arguments ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The expected arguments
    ``${2}``:
        String representation of all calls.


.. function:: refute.calledOnceWith

    ::

        refute.calledOnceWith(spy, arg1, arg2, ...)

    Fails if the spy was called exactly once and with the specified arguments.
    Other arguments may have been passed after the specified ones.

    ::

        var spy = this.spy();
        var arr = [1, 2, 3];
        spy(12);

        refute.calledOnceWith(spy, 12);     // Fails
        refute.calledOnceWith(spy, 42);     // Passes

        spy(42, 13);
        refute.calledOnceWith(spy, 42, 13); // Passes

    **Message**

    ::

        refute.calledOnceWith.message = "Expected ${0} not to be called once with arguments ${1}${2}";

    ``${0}``:
        The spy
    ``${1}``:
        The expected arguments
    ``${2}``:
        String representation of all calls.


.. _expectations:

Expectations
============

All of buster-assertion's assertions and refutations are also exposed as
"expectations". Expectations is just a slightly different front-end to the same
functionality, often preferred by the BDD inclined.

Expectations mirror assertions under different names. Refutations can be
expressed using ``expect(obj).not`` and then calling either of the expectations
on the resulting object.

::

    var expect = buster.assertions.expect;

    expect({ id: 42 }).toBeObject(); // Passes
    expect("Somewhere in here").toMatch("in"); // Passes
    expect(42).not.toEqual(43); // Passes


.. function:: expect.toBe

    ::

        expect(actual).toBe(expected)

    See :func:`assert.same`


.. function:: expect.toEqual

    ::

        expect(actual).toEqual(expected)

    See :func:`assert.equals`


.. function:: expect.toBeDefined

    ::

        expect(actual).toBeDefined(expected)

    See :func:`assert.defined`


.. function:: expect.toBeNull

    ::

        expect(actual).toBeNull(expected)

    See :func:`assert.isNull`


.. function:: expect.toMatch

    ::

        expect(actual).toMatch(expected)

    See :func:`assert.match`


.. function:: expect.toBeObject

    ::

        expect(actual).toBeObject(expected)

    See :func:`assert.isObject`


.. function:: expect.toBeFunction

    ::

        expect(actual).toBeFunction(expected)

    See :func:`assert.isFunction`


.. function:: expect.toThrow

    ::

        expect(actual).toThrow(expected)

    See :func:`assert.exception`


.. function:: expect.toHaveTagName

    ::

        expect(actual).toHaveTagName(expected)

    See :func:`assert.tagName`


.. function:: expect.toHaveClassName

    ::

        expect(actual).toHaveClassName(expected)

    See :func:`assert.className`


.. function:: expect.toHaveBeenCalled

    ::

        expect(spy).toHaveBeenCalled()

    See :func:`assert.called`


.. function:: expect.toHaveBeenCalledOnce

    ::

        expect(spy).toHaveBeenCalledOnce(expected)

    See :func:`assert.calledOnce`


.. function:: expect.toHaveBeenCalledTwice

    ::

        expect(spy).toHaveBeenCalledTwice(expected)

    See :func:`assert.calledTwice`


.. function:: expect.toHaveBeenCalledThrice

    ::

        expect(spy).toHaveBeenCalledThrice(expected)

    See :func:`assert.calledThrice`


.. function:: expect.toHaveBeenCalledWith

    ::

        expect(spy).toHaveBeenCalledWith(arg1, arg2, ...)

    See :func:`assert.calledWith`


.. function:: expect.toHaveBeenCalledOnceWith

    ::

        expect(spy).toHaveBeenCalledOnceWith(arg1, arg2, ...)

    See :func:`assert.calledOnceWith`


Methods
=======

.. function:: assertions.fail

    ::

        buster.assertions.fail(message)

    When an assertion fails, it calls :func:`assertions.fail` with the failure
    message as the only argument. The built-in ``fail`` function both throws an
    :class:`AssertionError` and emits it to the `failure <#event-failure>`_
    event. The error can be caught and handled by the test runner. If this
    behavior is not suitable for your testing framework of choice, you can
    override :func:`assertions.fail` to make it do the right thing.

    Example: To use **buster-assertions** with JsTestDriver, you can simply
    configure it as follows::

        buster.assertions.fail = function (message) {
            fail(message);
        };

    Where the global ``fail`` function is the one provided by JsTestDriver.

    It is possible to make the default ``assert.fail`` method only emit an
    event and not throw an error. This may be suitable in asynchronous test
    runners, where you might not be able to catch exceptions. To silence
    exceptions, see the :attr:`throwOnFailure` property.


.. function:: assertions.format

    ::

        buster.assertions.format(object)

    Values inserted into assertion messages using the ``${n}`` switches are
    formatted using :func:`assertions.format`. By default this method simply
    coerces the object to a string.

    A more expressive option is to use :ref:`buster-format`, which is a generic
    function for formatting objects nicely as ASCII. For nice ASCII formatting
    of objects (including DOM elements) do::

        buster.assertions.format = buster.format.ascii;


.. function:: assertions.add

    ::

        buster.assertions.add(name, options)

    Add a custom assertion. Using this 'macro' to add project specific
    assertions has a few advantages:

    - Assertions will be counted.

    - Failure messages will have interpolated arguments formatted by
      :func:`assertions.format`.

    - A single function generates both an assertion and a refutation.

    - If using expectations, an expectation can easily be generated as well.

    - When ```failOnNoAssertions`` <#failOnNoAssertions>`_ is set to ``true``,
      the assertion will behave correctly (may be important for asynchronous
      tests).

    - The assertion will fail if too few arguments are passed.

    Here's an example of adding a "foo" assertion, that only passes when its
    only argument is the string "foo"::

        var assert = buster.assertions.assert;
        var refute = buster.assertions.refute;
        var expect = buster.assertions.expect;

        buster.assertions.add("isFoo", {
            assert: function (actual) {
                return actual == "foo";
            },
            assertMessage: "Expected ${0} to be foo!",
            refuteMessage: "Expected not to be foo!",
            expectation: "toBeFoo"
        });

        // Now you can do:
        // Passes
        assert.isFoo("foo");

        // Fails: "[assert.isFoo] Expected { id: 42 } to be foo!"
        assert.isFoo({ id: 42 });

        // Fails: "[assert.isFoo] Ouch: Expected { id: 42 } to be foo!"
        assert.isFoo({ id: 42 }, "Ouch");

        // Fails: "[refute.isFoo] Expected not to be foo!"
        refute.isFoo("foo");

        // Passes
        expect("foo").toBeFoo();

    **Error message value interpolation**

    Arguments are available in assertion failure messages using the ``"${n}"``
    switches, where ``n`` is a number. You can also use named variables by
    setting properties on ``this`` in the assertion/refutation function::

        buster.assertions.add("isString", {
            assert: function (actual) {
                this.actualType = typeof actual;
                return this.actualType == "string";
            },
            assertMessage: "Expected ${0} (${actualType}) to be string",
            refuteMessage: "Expected not to be string",
            expectation: "toBeString"
        });

    **Arguments**

    ``name``:
        The name of the new assertion/refutation.

    ``options``:

        ``assert``:

            The verification function. Should return ``true`` when the
            assertion passes. The generated refutation will pass when the
            function returns false.

            In some cases the refutation may not be the exact opposite of the
            assertion. If that is the case you should provide
            ``options.refute`` for the custom refutation.

            The number of formal parameters the function accepts determines the
            number of required arguments to the function. If the assertion is
            called with less arguments than expected, Buster will fail it
            before your custom function is even called.

            All arguments are available for interpolation into the resulting
            error message. The first argument will be available as ``"${0}"``,
            the second as ``"${1}"`` and so on. If you want to embed other
            values than exact arguments into the string, you can set properties
            on ``this`` in the custom assertion, and refer to them as
            ``"${name}"`` in the message.

        ``refute``:

            Custom refutation function. Used over ``!assert()`` if provided.

        ``assertMessage``:

            The error message to use when the assertion fails. The message may
            refer to arguments through switches like ``"${0}"`` and so on (see
            above, under the ``assert`` argument). The message is exposed on
            the generated assertion as the property ``assert.[name].message``.

        ``refuteMessage``:

            Like ``assertFail``, but for refutations. Exposed as
            ``refute.[name].message``.

        ``values``:

            A function that maps values to be interpolated into the failure
            messages. This can be used when you need something more/else than
            the actual arguments in order.

        ``expectation``:

            The name of the assertion as an expectation, e.g. "toBeSomething".
            Optional.


Supporting utilities
====================


.. function:: buster.isNode

    ::

        buster.isNode(object)

    Returns ``true`` if the object is a DOM node. The check is made by
    attempting to call ``appendChild`` on it, passing in an element.

.. function:: buster.isElement

    ::

        buster.isElement(object)

    Returns ``true`` if the object is a DOM element. The check is made
    by calling :func:`buster.isNode` and asserting that the element's
    ``nodeType`` is 1 (i.e. element).

.. function:: assertions.isArguments

    ::

        buster.assertions.isArguments(object)

    Returns true if the argument is an ``arguments`` object. Buster checks this
    by making sure the object is array-like, but not actually an array.

    ::

        function check() {
            buster.isArguments(arguments); // true
        }

        buster.isArguments([]); // false


.. function:: assertions.keys

    ::

        buster.assertions.keys(object)

    Cross-browser implementation of
    `Object.keys <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys>`_.
    From MDN:

    | returns an array whose elements are strings corresponding to the
    | enumerable properties found directly upon object. The ordering of the
    | properties is the same as that given by looping over the properties of
    | the object manually.


Properties
==========


.. attribute:: assertions.count

    Number increasing from 0.

    ``buster.assertions.count`` is incremented anytime an assertion is called.
    The assertion counter can be reset to any number at your convenience.


.. attribute:: throwOnFailure

    Boolean.

    When using the default :func:`assertions.fail` implementation, this
    property can be set to ``false`` to make assertion failures **not** throw
    exceptions (i.e. only emit events). This may be suitable in asynchronous
    test runners, where you might not be able to catch exceptions.


Supporting objects
==================

.. class:: AssertionError

    An exception (specifically, an `Error object
    <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error>`_)
    whose ``name`` property is ``"AssertionError"``.
