var config = exports; // Vanity

config["Browser tests"] = {
    environment: "browser",
    sources: ["strftime.js"],
    tests: ["strftime-test.js"]
};

config["Server tests"] = {
    extends: "Browser tests",
    environment: "node"
};
