.. _extensions:
.. highlight:: javascript

===================
Building Extensions
===================

.. note::

    Extension hooks are still in their infancy. If you find it impossible to
    add some desired behavior through an extension,
    `file an issue <https://github.com/busterjs/buster/issues>`_.

Extensions adds to or enhances the capabilities of Buster.JS at runtime. An
extension will typically use regular Buster APIs to do their bidding. However,
in order to hook you into the right places, Buster.JS provides a series of
extension points where you can add custom functionality.

A Buster.JS extension is an object that optionally exposes
a ``create`` method, that will receive custom configuration, and one
or more methods that implement an extension hook. The number of hooks is
expected to increase in the near future.

Create: ``var instance = ext.create([options]);``
=================================================

If provided, the ``create`` method is called with any custom
configuration for the extension. Custom configuration is any value assigned to
the property named after the extension in the configuration file, e.g.::

    module.exports["Some tests"] = {
        extensions: [require("my-extension")],
        "my-extension": whatever
    };

In order for this to work, the extension must export a ``name``
property, i.e. ``module.exports = { name: "my-extension", ... }``
in the case above. Although you don't explicitly have to, it's good practice
to name the extension after its package name.

The ``create`` method is not required. If it's not provided, the
extension will not receive its custom configuration.

Hook: ``configure``
===================

The ``configure`` hook allows extensions to manipulate :ref:`resource-sets`
assigned to a test run. Resource sets contain all files and other resources
required for a test run. You can use this hook to modify only sources, only
tests, framework resources, everything or any other combination. Read the
documentation for :doc:`buster-configuration </modules/buster-configuration>`
to understand how files are loaded and how you can hook into that process.

To implement this hook, simply provide a ``configure`` method on your
extension object. The following example adds a resource to the framework
group::

    module.exports = {
        create: function (options) {
            var instance = Object.create(this);
            instance.options = options;
            return instance;
        },

        configure: function (group) {
            group.on("load:framework", function (resourceSet) {
                resourceSet.addResource({
                    path: "/oh-yeah.js",
                    content: "buster.log('Extension calling!');"
                });
            });
        }
    };

Hook: ``beforeRun``
===================

The ``beforeRun`` hook is run, after the test run configuration is
fully loaded, but before the test runner has been initialized. The arguments
passed to this hook is ``config`` (a :ref:`config-group`) and ``analyzer``.
The analyzer can be used to flag issues about the code base, and is what
``buster-lint`` and ``buster-syntax`` uses to warn about lint and syntax
errors, respectively.

Proper documentation for the analyzer is pending. For now, refer to
`buster-lint <https://github.com/magnars/buster-lint>`_ for a usage
example.

Hook: ``testRun``
=================

The ``testRun`` hook is executed right before tests are run. It
receives one or two arguments, depending on the environment.

Browser environment: ``testRunner``, ``messagingClient``
--------------------------------------------------------

Both arguments are event emitters. The ``testRunn`` is a "remoteRunner" (not
yet documented). It behaves like a :ref:`buster-test-runner`, i.e. it emits all
the same events. However, because the run potentially includes more than one
browser, the remote runner wraps all test cases in an additional top-level
context which is named after the browser that ran it.

The ``messagingClient`` contains all raw messages emitted in the
browsers. The messages are wrapped in an envelop that also contains
information about the browser that sent it::

    {
        data: { name: 'My context' },
        topic: 'context:start',
        clientId: 'eaebee40-ff08-4fcd-bc97-2da569e837c3',
        client: { emit: [Function] } 
    }

Node environment: ``testRunner``
--------------------------------

Node tests only receives a single runner argument. It is a plain
:ref:`buster-test-runner`.
