var merge = require("lodash.merge");

var defaults = require("./default.js");
var config = require("./" + (process.env.NODE_ENV || "development").trim() + ".js");

module.exports = merge({}, defaults, config);