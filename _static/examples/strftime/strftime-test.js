if (typeof require == "function" && typeof module == "object") {
    buster = require("buster");
    require("./strftime");
}

var assert = buster.assert;

buster.testCase("Date strftime tests", {
    setUp: function () {
        this.date = new Date(2009, 11, 5);
    },

    "%Y": {
        setUp: function () {
            this.year = this.date.strftime("%Y");
        },

        "should return full year": function () {
            assert.equals(this.year, "2009");
        },

        "should return a string": function () {
            assert.equals(typeof this.year, "string");
        }
    },

    "%y should return two digit year": function () {
        assert.equals(this.date.strftime("%y"), "09");
    },

    "%m should return month": function () {
        assert.equals(this.date.strftime("%m"), "12");
    },

    "%d should return date": function () {
        assert.equals(this.date.strftime("%d"), "05");
    },

    "//%j should return the day of the year": function () {
        var date = new Date(2011, 0, 1);
        assert.equals(date.strftime("%j"), 1);
    }
});
