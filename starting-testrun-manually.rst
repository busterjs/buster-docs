.. highlight:: javascript
.. _starting-testrun-manually:

==========================
Manually starting test run
==========================

When you use AMD (Asynchronous Module Loading) systems, or otherwise need to
manually specify when your system is ready to run tests, you can easily disable
auto running of tests and manually start the test run. Normally, Buster.JS
starts running tests when the browser has finished loading the page. Since AMD
is a manual module loader that Buster.JS can't automatically be aware of, you
are required to manually tell Buster.JS when you're good to go.

Add ``autoRun: false`` to your config file::

    var config = module.exports;

    config["My tests"] = {
        autoRun: false,
        sources: ["../lib/**/*.js"],
        tests: ["**/*-test.js", "run.js"]
    }

we added the file ``run.js`` to the ``tests`` group. In this file, call
``buster.run()`` to start the test run::

    // App specific notification of when your app is ready to be tested
    myApp.onReady = function () {
        buster.run();
    };

You're of course free to call ``buster.run()`` anywhere you want, the only
important thing is that it gets called when you load your tests, and when it
gets called your application is ready to get tested.

If you use the :ref:`buster-amd` extension, it will do this automatically for you
and you do not need to set ``{ autoRun: false }`` or call ``buster.run()``.
