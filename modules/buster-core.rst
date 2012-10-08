.. default-domain:: js
.. highlight:: javascript
.. _buster-core:

===========
buster-core
===========

Version:
    0.4.0 (2011-08-26)
Module:
    ``require("buster-core");``
In browsers:
    ``buster;``

A collection of utilities commonly used across Buster.JS projects. The module
is stable and can be freely used when extending Buster, or for any other
projects should you wish to do so.


Methods
=======

.. function:: buster.bind

    ::

        buster.bind(object, methodOrString);

    Binds a function to an object, such that its ``this`` value is fixed
    regardless of how it's called. The function works much like
    ```Function.prototype.bind``
    <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind>`_.
    It is provided here to work in environments that do not support
    ``Function.prototype.bind``.

    ::

        var homer = {
            name: "Homer",

            burp: function () {
                return this.name + " goes buuuuuurp";
            }
        };

        var func = buster.bind(homer, homer.burp);
        func(); // "Homer goes buuuuuurp"

        var func2 = buster.bind(homer, "burp");
        func2(); // "Homer goes buuuuuurp"


.. function:: buster.create

    ::

        buster.create(object);

    Cross-browser implementation of `Object.create
    <https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create>`_.

    ``buster.create`` only supports creating a new object with the specified
    object as its prototype. It does not support property descriptors.


.. function:: buster.extend

    ::

        buster.extend(target[, source1[, source2[, ...]]]);

    Extends the target object by copying all the properties of all the sources
    onto it. Sources as processed in order. The method also returns the target
    object.

    ::

        var target = { id: 42, num: 0 };

        target = buster.extend(target,
                               { id: 13, name: "One" },
                               { name: "Two", prop: "erty" });

        //=> { id: 13, num: 0, name: "Two", prop: "erty" }


.. function:: buster.nextTick

    ::

        buster.nextTick(callback);

    Calls the callback on the next tick of the event loop. On Node.js this
    method simply delegates to ``process.nextTick``. In the browser,
    ``nextTick`` is emulated by passing the callback to ``setTimeout(callback,
    0)``.


.. function:: buster.functionName

    ::

        buster.functionName(func);

    Returns the name of the function, or an empty string if the ``function`` is
    a falsy value. The method tries three approaches, returning an empty string
    if all approaches fail:

    #. Return ``func.displayName``
    #. Return ``func.name``
    #. Attempt to infer the name through ``func.toString()``


.. _event-emitter:

Event emitter
=============

A standalone Node.js and browser compatible event emitter API.

.. function:: eventEmitter.create

    ::

        var emitter = buster.eventEmitter.create();

    Creates a new event emitter object.


.. function:: eventEmitter.addListener

    ::

        emitter.addListener(event, listener[, thisObject])

    Adds the listener function to the named event. The optional ``thisObject``
    will be the ``this`` of the listener when called.

    ::

        emitter.addListener("myevent", function () {
            // ...
        });


.. function:: eventEmitter.on

    ::

        emitter.on(event, listener[, thisObject]);

    Alias to ``addListener``.


.. function:: eventEmitter.once

    ::

        emitter.once(event, listener[, thisObject]);

    Like ``addListener``, but is removed after one emission.

    ::

        emitter.once("myevent", function () {
            console.log("hello");
        });
        emitter.emit("myevent"); // Logs "hello"
        emitter.emit("myevent"); // Nothing happens


.. function:: eventEmitter.emit

    ::

        emitter.emit(event[, arg1, arg2, ...]);

    Emits the event, triggering all the listeners with the given arguments.

    ::

        emitter.addListener("myevent", function (a, b, c) {
            console.log(a, b, c);
        });
        emitter.emit("myevent");            // undefined, undefined, undefined
        emitter.emit("myevent", {}, "foo"); // {}, "foo", undefined


.. function:: eventEmitter.removeListener

    ::

        emitter.removeListener(event, listener);

    Removes the listener for that event.

    ::

        var mylistener = function () {};
        emitter.addListener("myevent", mylistener);
        emitter.removeListener("myevent", mylistener);
        emitter.emit("myevent"); // Does not call 'mylistener'



.. function:: eventEmitter.hasListener

    ::

        emitter.hasListener(event, listener[, thisObject]);

    Tests if the event emitter has the given listener for that event,
    optionally a listener for the given ``thisObject``.

    ::

        var func1 = function () {};
        var func2 = function () {};
        var thisObj = {};

        emitter.addListener("foo", func1);
        emitter.addListener("bar", func2,  thisObj);

        emitter.hasListener("foo", func1); // true
        emitter.hasListener("foo", func2); // false

        emitter.hasListener("bar", func1); // false
        emitter.hasListener("bar", func2); // true

        emitter.hasListener("bar", func2, {});      // false
        emitter.hasListener("bar", func2, thisObj); // true
