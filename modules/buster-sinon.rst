.. default-domain:: js
.. highlight:: javascript
.. _buster-sinon:

============
buster-sinon
============

`Sinon.JS <http://sinonjs.org/>`_ integration.

.. warning::
  This documentation is incomplete.

Sinon specific assertions are documented at :ref:`referee`.

Refer to `the Sinon.JS documentation <http://sinonjs.org/docs/>`_ and do some
guesswork for the other functionality.

Quick cheat sheet
=================
::

    buster.testCase("Foo", {
        "test a stub": function () {
            // Overrides "aMethod" and restores when test finishes running
            this.stub(myLib, "aMethod");
            myLib.otherThing();
            assert.calledOnce(myLib.aMethod);
        },

        "test a spy": function () {
            // Wraps "aMethod". The original method is called, and you can also
            // do stub like assertions with it.
            this.spy(myLib, "aMethod");
            myLib.otherThing();
            assert.calledOnce(myLib.aMethod);
        }
    });
    

.. _testing-ajax:

Testing AJAX
============

Sinon.JS mocks out the underlying ``XMLHttpRequest`` (or ``ActiveXObject``)
object, so your HTTP libraries don't need any modification to be testable in
this way - even when using jQuery or another 3rd party library for your HTTP
connections. ::

    var assert = buster.assert;

    buster.testCase("My tests", {
        setUp: function () {
            this.server = this.useFakeServer();
        },

        "should POST to /todo-items": function () {
            myThing.createTodoItem("Some item");

            assert.equals(this.server.requests.length, 1);
            assert.match(this.server.requests[0], {
                method: "POST",
                url: "/todo-items"
            });
        },

        "should yield list item to callback on success": function () {
            this.server.respondWith(
                "POST",
                "/todo-items",
                [200, {"content-type": "application/json"},
                '{"text":"Fetch eggs","done":false,"id":1}']);

            var callback = this.spy();
            // Assuming implementation calls the callback with a JSON.parsed
            // response body when the request ends
            myThing.createTodoItem("Fetch eggs", callback);

            // Cause the request to respond, based on respondsWith above.
            this.server.respond();

            // Sinon.JS replaces the entire XHR stack and synchronously handles
            // the request.
            assert.calledOnce(callback);
            assert.equals(callback.getCall(0).args[0], {
                text: "Fetch eggs", done: false, id: 1
            });
        }
    });

Minimal implementation for ``myThing`` to pass the tests::

    var myThing = {
        createTodoItem: function (str, cb) {

            var http = new XMLHttpRequest();
            var url = "/todo-items";
            http.open("POST", url, true);

            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            http.onreadystatechange = function () {
                if(http.readyState == 4 && http.status == 200) {
                    if (cb) {
                       cb(JSON.parse(http.responseText));
                    }
                }
            }
            http.send();
        }
    }

