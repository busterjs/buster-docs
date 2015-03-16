.. default-domain:: js
.. highlight:: javascript
.. _buster-ci:


buster-ci
=========

To run `buster-ci`, you need a config file named "buster-ci.js" in the working directory.
Lets have a look at the following example config file, to see, what can be configured.

::

    module.exports = {

        outputFile: "d:/temp/test/out.xml",

        server: {
            host: "ci-host",
            port: 1111
        },

        browsers: {
            Chrome: {
                start: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                startArgs: [
                    "--new-window",
                    "--user-data-dir=d:/temp/test"
                ]
            },
            FF: {
                prepareStart: "cp d:/temp/test/prefs-template.js d:/temp/test/prefs.js",
                start: "C:/Program Files (x86)/Mozilla Firefox/firefox.exe",
                startArgs: ["-profile", "d:/temp/test", "-no-remote"]
            },
            IE: {
                start: "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
                stop: {
                    command: "taskkill /F /IM iexplore.exe /T"
                }
            }
        },

        agents: {
            localhost: {
                port: 8888,
                browsers: ["FF", "Chrome", "IE"]
            },
            remotehost1: {
                port: 8888,
                browsers: ["FF"]
            },
            remotehost2: {
                port: 8888,
                browsers: ["IE"]
            }
        },

        captureTimeout: 40,
        closeTimeout: 40,

        logLevel: "debug"
    };

`outputFile`

    ::

        outputFile: "d:/temp/test/out.xml",

    Specifies the target file for the test result in xUnit compatible xml format.


`server`

    ::

        server: {
            host: "ci-host",
            port: 1111
        },

    This is the host, where `buster-ci` is executed. The **port** is used to
    start `buster-server`. **host** and **port** are used for the capturing url for the browsers.
    If you only want to start browsers on the local host, you can use "localhost" or "127.0.0.1"
    as **host**. But if you also want to start browsers on remote hosts, you have to use an ip address
    or hostname, which can be used, to get access to the host in the network.


`browsers`

    ::

        browsers: {
            Chrome: {
                start: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
                startArgs: [
                    "--new-window",
                    "--user-data-dir=d:/temp/test"
                ]
            },
            FF: {
                prepareStart: "cp d:/temp/test/prefs-template.js d:/temp/test/prefs.js",
                start: "C:/Program Files (x86)/Mozilla Firefox/firefox.exe",
                startArgs: ["-profile", "d:/temp/test", "-no-remote"]
            },
            IE: {
                start: "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
                stop: {
                    command: "taskkill /F /IM iexplore.exe /T"
                }
            }
        },

    Before you can start and capture any browser, you first have to configure some. `buster-ci`
    needs some informations, for example how a browser can be started, which command line arguments
    should be used and so forth. The informations here are only for the local host. The remote browsers
    have to be configured on the remote hosts, see :ref:`capture-remote-browsers`.

    With **start** you specify the command to start the browser. The command is passed to the
    `child_process.spawn <http://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options>`_
    function. Thus the arguments must be provided separately by the **startArgs** property.

    If you want to initialize something before the browser start, you can do this with the **prepareStart**
    property. This can be useful for example, if you want to provide a fresh and clean "prefs.js" file to configure
    firefox. In order that the command is executed in a shell, it is passed to
    `child_process_exec <http://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback>`_.
    Thus the arguments are provided directly with the command.

    Unfortunately not every brwoser can be closed by calling
    `child.kill <http://nodejs.org/api/child_process.html#child_process_child_kill_signal>`_
    for the process started by the **start** command. That's why `buster-ci` provides two additional ways
    how to stop/close a browser. See :ref:`closing-browsers` for more information.

    The names for the browsers can be chosen freely. That way you can provide more than one configuration
    for the same browser. `buster-ci` won't start the browsers configured here automatically.
    You have to specify the browsers to be started in the **agents** section.


`agents`

    ::

        agents: {
            localhost: {
                port: 8888,
                browsers: ["FF", "Chrome", "IE"]
            },
            remotehost1: {
                port: 8888,
                browsers: ["FF"]
            },
            remotehost2: {
                port: 8888,
                browsers: ["IE"]
            }
        },

    `buster-ci` uses the :ref:`buster-ci-agent` to start, capture and stop browsers.
    It's not only used for remote browsers, but also for the browsers to be started on the local host.
    If you want to start browsers on the local host, you must specify an agent named "localhost".
    If you want to start browsers on remote hosts, you must specify agents named with the remote hostnames
    or ip addresses.

    **port** is where the `buster-ci-agent` is listening for incoming requests. **browsers** is the list
    of browsers which shall to be started by the agent. The names must match the names of browsers from the
    `browsers` section.

    The agent for the local host is started by `buster-ci` automatically and must not be started manually.
    The agents for the remote hosts have to be up and running before the test run. More information about that
    can be found in section :ref:`capture-remote-browsers`.


`captureTimeout`

    ::

        captureTimeout: 40,

Overwrites the timeout for waiting for all browsers are captured, in seconds. Default value is 30s.


`closeTimeout`

    ::

        closeTimeout: 40,

Overwrites the timeout for waiting for all browsers are closed, in seconds. Default value is 30s.


`logLevel`

    ::

        logLevel: "debug"

Sets one of the log level "error", "warn", "log", "info", "debug", default is "info".
The log level is also used for the local agent. If a lower log level is configured for a remote agent,
less of information is provided for that agent by `buster-ci`.


.. _capture-remote-browsers:

Capturing remote browsers
-------------------------

You don't need a full `Buster.JS` installation to capture browsers. All you need is `buster-ci-agent`.

::

    npm install buster-ci-agent

The agent is looking for a configuration file named "buster-ci-agent.js" in the working directory.
These are the configuration files for the two remote hosts of the example:

remotehost1 (Ubuntu, FF 29.0)

::

    module.exports = {

        port: 8888,
        browsers: {
            FF: {
                start: "firefox",
                startArgs: ["-profile", "/home/me/tmp/test", "-no-remote"]
            }
        },
        logLevel: "debug"
    };

remotehost2 (Windows 7, IE 11)

::

    module.exports = {

        port: 8888,
        browsers: {
            IE: {
                start: "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
                stop: {
                    windowTitle: "Buster - Internet Explorer"
                }
            }
        },
        logLevel: "debug"
    };

**port** is where the agent is listening for incoming requests of `buster-ci`.

**browsers** is exactly the same as for the local host configuration in the `buster-ci.js`
configuration file.

**logLevel** specifies the log level for the agent and also affects the amount of logging information
sent back to `buster-ci`.


Starting agent
^^^^^^^^^^^^^^

The agent can be started by:

::

    ./node_modules/buster-ci-agent/bin/buster-ci-agent

or

::

    node_modules/.bin/buster-ci-agent.cmd


.. _capture-headless-browser:

Capturing headless browser
--------------------------

If you want `buster-ci` to run browser tests headless with **PhantomJS**, corresponding to the option `-c`
for `buster-server` if started manually, you only have to add the option `server.runPhantom = true` in the
`buster-ci` configuration.

::

module.exports = {

    server: {
        host: "ci-host",
        port: 1111,
        runPhantom: true
    }
};


.. _closing-browsers:

Closing browsers
----------------

is not as easy as it seems to be at a first glance. Unfortunately some browsers do things, which
make it hard to just close the browser by `child.kill`.

The "iexplore.exe" of IE 11 for example creates
two new processes. The original process will be closed right after the two processed are created.
Thus calling `child.kill` has no effect.

A chrome browser can't be closed by calling `child.kill`, if another browser is open, which uses the
same user data directory. In that case `child.kill(SIGKILL)` has to be called, which will close all
browsers using the same user data directory. That's why it is a good idea to specifiy a separate
user data directory for the test browsers.

If you try to kill a firefox browser while a second instance is open and using the same profile
directory, the browser will be closed, but you will also get an error message and you will get problems
to start the browser again at some point. So, as well as for chrome, it's a good idea to use a
separate profile directory for the test browsers.

`buster-ci` provides two additional ways to close browsers, configured via **stop.command**
and **stop.windowTitle**.


stop.command
^^^^^^^^^^^^

You can specify a command that will be executed to close the browser. The IE of the local host
from the example is closed by the command `"taskkill /F /IM iexplore.exe /T"`, which kills
all instances of the IE in fact. If you need the PID of the process started by the command
specified in the **start** property, use the placeholder `${PID}`.



stop.windowTitle
^^^^^^^^^^^^^^^^

`buster-ci` can close windows with a given window title by using `node-ffi <https://www.npmjs.org/package/node-ffi>`_.
In our example all windows with title "Buster - Internet Explorer" are closed on remotehost2.

This feature is currently only implemented for Windows.

The packages needed for this feature are declared as optional, because they have to be compiled
during installation process. Thus you don't have to establish a toolchain for every remote
host, unless you want to use that feature.


Starting test run
-----------------

The `buster-ci` run can be started by entering `buster-ci` or `buster-ci.cmd` in the directory where the config
file `buster-ci.js` is located. Arguments passed to `buster-ci` are passed along to `buster-test`.


Example Run
^^^^^^^^^^^

`buster-ci`

::

    start local agent
    Agent Running, waiting for commands on port 8888
    buster-ci-server running on http://localhost:1111
    create faye client for agent: remotehost2
    sendMessage: { command: "ping" }
    create faye client for agent: remotehost1
    sendMessage: { command: "ping" }
    create faye client for agent: localhost
    sendMessage: { command: "ping" }
    received command: { command: "ping" }
    welcome agent: remotehost2
    welcome agent: remotehost1
    welcome agent: localhost
    sendMessage: { command: "Welcome" }
    sendMessage: { command: "Welcome" }
    sendMessage: { command: "Welcome" }
    received command: { command: "Welcome" }
    localhost: {
      browsers: {
        Chrome: {
          start: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
          startArgs: ["--new-window", "--user-data-dir=d:/temp/test"]
        },
        FF: {
          prepareStart: "cp d:/temp/test/prefs-vorlage.js d:/temp/test/prefs.js",
          start: "C:/Program Files (x86)/Mozilla Firefox/firefox.exe",
          startArgs: ["-profile", "d:/temp/test", "-no-remote"]
        },
        IE: {
          start: "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
          stop: { command: "taskkill /F /IM iexplore.exe /T" }
        }
      }
    }
    validateBrowserConfig
    remotehost2: received command: { command: "ping" }
    remotehost2: received command: { command: "Welcome" }
    remotehost2: {
      browsers: {
        IE: {
          start: "C:/Program Files (x86)/Internet Explorer/iexplore.exe",
          stop: { windowTitle: "Buster - Internet Explorer" }
        }
      }
    }
    validateBrowserConfig
    remotehost1: {
      browsers: {
        FF: {
          start: "firefox",
          startArgs: ["-profile", "/home/me/tmp/test", "-no-remote"]
        }
      }
    }
    validateBrowserConfig
    capture browsers
    ["1","2","3","4","5"]
    sendMessage: {
      browsers: { Chrome: { id: 2 }, FF: { id: 1 }, IE: { id: 3 } },
      command: "start",
      url: "http://ci-host:1111/capture"
    }
    sendMessage: {
      browsers: { FF: { id: 4 } },
      command: "start",
      url: "http://ci-host:1111/capture"
    }
    sendMessage: {
      browsers: { IE: { id: 5 } },
      command: "start",
      url: "http://ci-host:1111/capture"
    }
    received command: {
      browsers: { Chrome: { id: 2 }, FF: { id: 1 }, IE: { id: 3 } },
      command: "start",
      url: "http://ci-host:1111/capture"
    }
    prepare start
    cp d:/temp/test/prefs-vorlage.js d:/temp/test/prefs.js
    start browser FF
    start browser Chrome
    start browser IE
    remotehost1: start browser FF
    remotehost2: received command: {
      browsers: { IE: { id: 5 } },
      command: "start",
      url: "http://ci-host:1111/capture"
    }
    remotehost2: start browser IE
    remotehost2: browser IE closed
    browser IE closed
    slave ready: { slaveId: "5" }
    ["1","2","3","4"]
    slave ready: { slaveId: "2" }
    ["1","3","4"]
    slave ready: { slaveId: "4" }
    ["1","3"]
    slave ready: { slaveId: "3" }
    ["1"]
    slave ready: { slaveId: "1" }
    []
    All browsers are ready.
    run tests
    close browsers
    ["1","2","3","4","5"]
    sendMessage: { browsers: { Chrome: { id: 2 }, FF: { id: 1 }, IE: { id: 3 } }, command: "stop" }
    sendMessage: { browsers: { FF: { id: 4 } }, command: "stop" }
    sendMessage: { browsers: { IE: { id: 5 } }, command: "stop" }
    remotehost1: stop browser FF
    received command: { browsers: { Chrome: { id: 2 }, FF: { id: 1 }, IE: { id: 3 } }, command: "stop" }
    stop browser FF
    stop browser Chrome
    stop browser IE by command
    taskkill /F /IM iexplore.exe /T
    remotehost1: browser FF closed
    remotehost2: received command: { browsers: { IE: { id: 5 } }, command: "stop" }
    remotehost2: stop browser IE by closing window
    slave disconnected gracefully: { slaveId: "5" }
    ["1","2","3","4"]
    browser Chrome closed
    browser FF closed
    slave timed out: { slaveId: "1" }
    ["2","3","4"]
    slave timed out: { slaveId: "2" }
    ["3","4"]
    slave timed out: { slaveId: "4" }
    ["3"]
    slave timed out: { slaveId: "3" }
    []
    All browsers are closed.
    All done.


Content of "d:/temp/test/out.xml":

::

    <?xml version="1.0" encoding="UTF-8" ?>
    <testsuites>
        <testsuite errors="0" tests="1" time="0.001" failures="0" name="IE 11.0, Windows Server 2008 R2 / 7 7">
            <testcase time="0.024" classname="IE 11.0, Windows Server 2008 R2 / 7 7.Buster" name="this.element is defined"/>
        </testsuite>
        <testsuite errors="0" tests="1" time="0" failures="0" name="Firefox 29.0, Ubuntu">
            <testcase time="0.094" classname="Firefox 29.0, Ubuntu.Buster" name="this.element is defined"/>
        </testsuite>
        <testsuite errors="0" tests="1" time="0" failures="0" name="Firefox 33.0, Windows Server 2008 R2 / 7 7">
            <testcase time="0.014" classname="Firefox 33.0, Windows Server 2008 R2 / 7 7.Buster" name="this.element is defined"/>
        </testsuite>
        <testsuite errors="0" tests="1" time="0" failures="0" name="Chrome 38.0.2125.104, Windows Server 2008 R2 / 7 7">
            <testcase time="0.121" classname="Chrome 38.0.2125.104, Windows Server 2008 R2 / 7 7.Buster" name="this.element is defined"/>
        </testsuite>
        <testsuite errors="0" tests="1" time="0" failures="0" name="IE 10.0, Windows Server 2008 R2 / 7 7">
            <testcase time="0.155" classname="IE 10.0, Windows Server 2008 R2 / 7 7.Buster" name="this.element is defined"/>
        </testsuite>
    </testsuites>