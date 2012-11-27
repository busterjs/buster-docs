.. default-domain:: js
.. highlight:: javascript
.. _user-agent-parser:

=================
user-agent-parser
=================

Version:
    0.2.1 (2011-08-25)
Module:
    ``require("buster-user-agent-parser");``

Parse the user agent string, attempting to guess browser vendor and version as
well as the operating system. This module should only be used for (somewhat
unreliable) information, not for "feature" detection or control flow
alteration.

Buster.JS uses the user agent parser to display browser name/version in its
test runner.

::

    var userAgentParser = require("buster-user-agent-parser");

    var ua = "Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.7 " +
            "(KHTML, like Gecko) Chrome/7.0.517.44 Safari/534.7";
    var browser = userAgentParser.parse(ua);

    browser == {
        platform: "Linux",
        browser: "Chrome",
        version: "7.0.517.44"
    };


Methods
=======

.. function:: userAgentParser.parse

    ::

        var browserInfo = userAgentParser.parse(userAgentStr);

    "Parse" the user agent string. Tries to determine OS, browser vendor and
    browser version. Returns a :ref:`browser-info` object.


.. _browser-info:

Browser info
============

.. attribute:: browserInfo.platform

  The 'OS' name; Windows, Linux, OS X, iPad, iPhone, Android


.. attribute:: browserInfo.browser

  Browser name, like Firefox, Safari, Chrome, and so on


.. attribute:: browserInfo.version

  Browser version string
