.. default-domain:: js
.. highlight:: javascript

==========================
Reusing the capture server
==========================

One of the more interesting features of Buster.JS is its ability to run tests in
multiple real browsers simultaneously with reporting back to the console and,
theoretically for now, your IDE or any other environment.

The server that orchestrates the browser is called the "capture server", as it
captures browsers as its slaves, ready to obediently carry out its will. The
module that contains the capture-server is `Ramp
<https://github.com/busterjs/ramp>`_.

The ``ramp`` server knows nothing about testing. It provides a generic mechanism
for controlling browsers and remotely executing code in them. A messaging API is
used to exchange information between the *client* (i.e. the process that issues
code to execute) and the *slaves* (i.e. the actual browsers).

The following are three guides to integrating with the ``ramp`` capture server
to automate test runs with other test frameworks than Buster.JS. They range from
low effort and low flexibility to high effort and near indefinite flexibility.

Shimming your test runner's API on top of Buster.JS
===================================================

If your test runner implements relatively few features, it may be feasible to
simply shim its API and delegate to Buster.JS. This is the approach taken by
the `buster-jstestdriver <https://github.com/busterjs/buster-jstestdriver>`_
extension.

`Learn more about shimming on top of Buster.JS </howto/shimming-test-runner>`_.

Use Buster.JS's CLI tools with a custom test runner
===================================================

If you're looking to provide similar functionality as provided by the
``buster-server`` and ``buster-test`` binaries for your test framework, this
is a fairly low-effort way of piggy-backing a lot of functionality.

`Creating your own xx-server and xx-test </howto/reusing-cli-tools>`_.

Implement custom CLI tooling to work with the capture server
============================================================

For ultimate freedom you can implement your own runner and client to use the
capture server to automate test runs. Before considering this option, please
read the above guide, as you may find it provides you with enough flexibility
with significantly less effort.

`Creating a custom capture server task runner </howto/custom-ramp-runner>`_.
