.. default-domain:: js
.. highlight:: javascript
.. _posix-argv-parser:

=================
posix-argv-parser
=================

Version:
    0.1.0 (2011-05-27)

Module:
    ``require("posix-argv-parser");``

An unobtrusive ambiguity aware parser for command line interfaces (CLIs). It's
**unobtrusive** because it doesn't mandate a specific way of printing error
messages, help messages and other output, and because it has no control flow
wrapper DSL. It's **ambiguity aware** because it lets you specify how to handle
ambiguities such as ``-bar``, which can mean both ``-b -a -r`` and ``-b=ar``.

::

    var posixArgvParser = Object.create(require("posix-argv-parser"));

    var port = posixArgvParser.createOption("-p", "--port");
    port.hasValue = true; // So that the parser can read -p2345 as -p=2345
    port.defaultValue = 8282;
    port.addValidator(posixArgvParser.validators.integer(
        "Custom message. ${1} has to be a number."));

    var verbose = posixArgvParser.createOption("-v");
    verbose.addValidator(function () {
        if (this.timesSet > 3) {
            // See also asynchronous validators
            return "-v can only be 3 levels.";
        }
    });

    // Operands are statements without options.
    // I.e. mything --port=1234 path/to/stuff
    var rootPath = posixArgvParser.createOperand();
    rootPath.signature = "Presentation root directory"; // Used in error msgs
    rootPath.addValidator(posixArgvParser.validators.file()); // Will use default error msg
    rootPath.addValidator(posixArgvParser.validators.required());

    posixArgvParser.handle(process.argv.slice(2), function (errors) {
        if (errors) {
            console.log(errors[0]);
            return;
        }

        // Various useful ways to get the values from the options.
        verbose.timesSet; // Will be between 0 and 3.
        port.isSet;
        port.value;
        rootPath.value;
    });


Methods
=======

.. function:: Object.create(module)

    ::

        var posixArgvParser = Object.create(require("posix-argv-parser"));

    Creates a new instance of posix-argv-parser.

.. function:: posixArgvParser.createOption(opt1, [opt2, ...])

    ::

        var opt = posixArgvParser.createOption("opt1", "opt2", "opt3");

    Creates a new ``option``. An option has all the properties of an
    ``argument``, as well as :attr:`option.hasValue` and
    :attr:`option.timesSet`.

.. function:: posixArgvParser.addShorthand(opt, [argv1, ...])

    A shorthand is a convenience method for adding options to your CLI that
    actually sets other options.

    ::

        var opt = posixArgvParser.createOption("--environment");
        opt.hasValue = true;

        posixArgvParser.addShorthand("--development",
            ["--environment", "development"]);
        posixArgvParser.addShorthand("--production",
            ["--environment", "production"]);

    This makes passing ``--development`` an equlvalent to passing
    ``--environment development``.

.. function:: posixArgvParser.createOperand()

    ::

        var opd = posixArgvParser.createOperand();

    Creates a new operand. An operand has all the properties of an ``argument``.

.. function:: posixArgvParser.handle(args, callback)

    Performs parsing and validation of argv. In Node.JS, make sure to discard
    the first two items of `process.argv
    <http://nodejs.org/api/process.html#process_process_argv>`_, as they
    contain unrelated arguments ("node" and the file name).

    The callback is called with one argument, ``errors``, which is either
    undefined, or an array of errors and/or validation messages.

    ::

        var posixArgvParser = Object.create(require("posix-argv-parser"));
        posixArgvParser.handle(process.argv.slice(2), function (errors) {
            if (errors) {
                // Print an error msg, i.e. console.log(errors[0])
                return;
            }
            // Continue with normal operation. I.e. myOpt.hasValue,
            // myOpt.timesSet, otherOpt.value, etc.
        });


Arguments (options and operands)
================================

:func:`Options <posixArgvParser.createOption>` and :func:`operands
<posixArgvParser.createOperand>` are the two types of arguments handled by
posix-argv-parser, and they share common functionality, listed below this
introduction.

An **option** is a flag, with or without a value. ``-p``, ``-p abc``,
``-pabc``, ``-p=abc``, ``--port abc`` and ``--port=abc`` are all supported by
posix-argv-parser.

``-pabc`` can mean  both ``-p -a -b -c`` and ``-p=abc``. posix-argv-parser uses
:attr:`hasValue` to separate the two. With :attr:`hasValue` set to true,
``-pabc`` will be handled as ``-p=abc``. When false (default), it will be
handled as ``-p -a -b -c``. In that case you also need to have option handlers
for ``-a``, ``-b`` and ``-c``, or you'll get a validation error such as
``"unknown option -a"`` (depending on which option posix-argv-parser first
encountered that didn't exist).

An **operand** is an option-less value, i.e. ``foo`` (with no ``-b`` or
``--myopt`` prefixing it). It's commonly used for arguments that always have to
be passed. Examples of this are ``nano path/to/file.txt``, ``git checkout
master``, ``rmdir my_dir``, etc. The validators :func:`validators.file`,
:func:`validators.directory`, and :func:`validators.fileOrDirectory` are very
useful for operands.

Note that the parser can handle a mix and match of options and operands in any
order, i.e. ``mycommand --port 1234 my/directory`` and ``mycommand my/directory
--port 1234`` will both work.

Multiple operands will be applied in order of creation. I.e. ``mycommand
something`` with two operands will assign ``"something"`` to the first and
``undefined`` to the second.

See example usage at the beginning of this document for more information.

.. function:: arg.addValidator(validator)

    Adds a validator to an argument (option or operand).

.. attribute:: arg.isSet

    True or false depending on whether or not the argument was present in argv.

.. attribute:: arg.value

    The value of the argument. Is normally a string, but may be any object
    since validators can change argument values as they see fit. See
    :attr:`arg.actualValue`.

.. attribute:: arg.actualValue

    Override the value an argument gets from argv. This is probably only useful
    in validations. The :func:`validator.integer` built in validator uses this
    to set the value to a number object instead of a string object, for
    example.

.. attribute:: arg.operation

    ::

        myOpt.operation = function(promise) {
            // ...
        };

    Arguments can have an optional operation associated with it. When the
    argument is present in ``argv``, the handler will be executed before
    :func:`posixArgvParser.handle` resolves. The operation is handed a promise.
    Resolving the promise will set the :attr:`value of the argument
    <arg.value>`.  Rejecting it will make :func:`posixArgvParser.handle` return
    an error. This is useful because it guarantees that at the time you handle,
    you know you either have the correct operation value or an error.

    An example where operations are useful is to parse and read a config file
    on the file system::

        myOpt.operation = function (promise) {
            fs.readFile(myOpt.value, function (err, data) {
                if (err) {
                    promise.reject(err.message);
                } else {
                    promise.resolve(JSON.parse(data));
                }
            });
        };

.. attribute:: arg.signature

    The signature is used to identify options and operands in validation errors.
    Options automatically gets a signature consisting of the option flags assigned
    to it::

        var opt = posixArgvParser.createOption("-v", "--version");
        opt.signature; // "-v/--version"
        opt.signature = "-v"; // custom signature

    Specifying a signature is more useful for operands, since an operand doesn't
    have any data that it can use to auto generate a signature::

        var rootDir = posixArgvParser.createOperand();
        rootDir.signature; // undefined, operands has no default signature
        rootDir.signature = "Root directory";


Options
=======

Options has additional properties that operands doesn't have.

.. attribute:: option.timesSet

    The number of times an option has been set. Useful for options like ``-v``
    (verbose) which you might want to allow setting multiple times, giving the
    user more and more verbose output from your program::

        -v // 1
        -vv // 2
        -v -v -v -v // 4
        -v -vv -vv -vvv // 8

.. attribute:: option.hasValue

    If ``true``, it tells the parser that it should look for a value for this
    option. An error will be generated if the option is passed without a value.
    See :attr:`option.acceptsValueAbsence` to change this behaviour.

    The default value is ``false``.

    If ``false``, you'll get ``"unrecognized option 1234"`` for ``--port
    1234``, since the parser didn't know how to handle "1234".

.. attribute:: option.acceptsValueAbsence

    Allows for passing the option both with and without a value, when
    :attr:`option.hasValue` is true.

    Useful for cases where you have options that work with and without a value
    passed to it, such as ``--help`` and ``--help sometopic``.

    Defaults to ``false``.


Validators
==========

Validators lets you add requirements with associated error messages to options
and operands. Validators can also mutate the values of options. The
:func:`validator.integer` validator will for example set the value to a `Number
<http://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Number>`_
object upon successful validation.

posix-argv-parser has a number of built-in validators, and an API for adding
custom validators.


Built-in validators
-------------------

The built in validators provides a selection of generic validators. You can
customize the error messages by passing strings with tokens like ``"${1}"`` in
them. The number and value maps are documented for each validator.

::

    // Uses built-in error message
    posixArgvParser.validators.required();

    // Specify your own error message
    posixArgvParser.validators.required("${1} has to be set");

.. function:: validators.required(errorMessage)

    Fails if the option is not set.

    Custom error message:

    ``${1}``:
        The option :attr:`arg.signature`

.. function:: validators.integer(errorMessage)

    Will fail validation if the option was not an integer, i.e. ``"foo"`` and
    ``42.5``. Upon successful validation, the value of the option will be
    overwritten with the Number object for the passed value.

    Custom error message:

    ``${1}``:
        The specified number

    ``${2}``:
       The option :attr:`arg.signature`

.. function:: validators.number(errorMessage)

    Will fail validation if the option was not a number, i.e. ``"foo"`` and
    ``?``. Upon successful validation, the value of the option will be
    overwritten with the Number object for the passed value.

    Custom error message:

    ``${1}``:
        The specified number

    ``${2}``:
        The option :attr:`arg.signature`

.. function:: validators.file(errorMessage)

    Will fail validation if the option was not a path pointing to an existing
    file in the file system.

    Custom error message:

    ``${1}``:
        The specified file

    ``${2}``:
        The option :attr:`arg.signature`

.. function:: validators.directory(errorMessage)

    Will fail validation if the option was not a path pointing to an existing
    directory in the file system.

    Custom error message:

    ``${1}``:
        The specified directory

    ``${2}``:
        The option :attr:`arg.signature`

.. function:: validators.fileOrDirectory(errorMessage)

    Will fail validation if the option was not a path pointing to an existing
    file or directory in the file system. Will fail for block devices, sockets,
    et c.

    Custom error message:

    ``${1}``:
        The specified file or directory

    ``${2}``:
        The option :attr:`arg.signature`


Custom validators
-----------------

A validator is a function that returns a string, undefined, or a promise. The
``this`` scope in the function is the option for which the validator is being
performed.

::

    var opt = posixArgvParser.createOption("-v");
    opt.addValidator(function () {
        if (this.value == "can not be this value") {
            return "This is the error message.";
        }
    });

Promises are used to facilitate asynchronous validators. Here's an example of a
validator that checks if a file is larger than 1MB::

    var when = require("when");
    opt.addValidator(function () {
        var self = this;
        var deferred = when.defer();
        fs.stat(this.value, function (err, stat) {
            if (err) {
                deferred.resolver.reject("Unknown error: " + err);
            }

            if (stat.size > 1024) {
                deferred.resolver.reject(self.value + " (" +
                    self.signature + ") was larger than 1MB");
            } else {
                deferred.resolver.resolve();
            }
        });
        return deferred.promise;
    });

Given ``--myopt /path/to/file`` and the file is larger than 1MB, you'll get the
error message ``"/path/to/file (--myopt) was larger than 1MB"``.

Rejecting the promise counts as an error. The first argument should be a
string, and is the error message.


Providing ``--help``
====================

It's not in the nature of posix-argv-parser to automatically handle ``--help``
for you. It is however very easy to add such an option to your program::

    var posixArgvParser = Object.create(require("posix-argv-parser"));
    var options = [];

    var port = posix-argv-parser.createOption("--port");
    port.hasValue = true;
    port.defaultValue = 1234;
    port.helpText = "The port to start the server on.";
    options.push(port);

    var verbose = posixArgvParser.createOption("-v");
    verbose.helpText = "Level of detail in output. " +
        "Pass multiple times (i.e. -vvv) for more output.";
    options.push(verbose);

    var help = posixArgvParser.createOption("--help", "-h");
    help.helpText = "Show this text";
    options.push(help);

    posixArgvParser.handle(process.argv.slice(2), function (errors) {
        if (errors) {
            console.log(errors[0]); return;
        }

        if (help.isSet) {
            for (var i = 0; i < options.length; i++) {
                console.log(options[i].signature + ": " + options[i].helpText);
            }
        } else {
            // Proceed with normal program operation
        }
    });

Note that the ``helpText`` property is not built-in posix-argv-parser
functionality. It's just an arbitrary property on the option object that you
can use for the purpose of associating a help text with an option.
