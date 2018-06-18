"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var types_1 = require("./types");
var LOG_LEVEL = "FATAL";
exports.jidParse = function (jid) {
    var parts = jid.match(/^([^@]+)@([^\/]+)(\/([\S]+))?$/);
    if (!parts || !(parts instanceof Array) || parts.length < 5) {
        return null;
    }
    return {
        username: parts[1],
        domain: parts[2],
        resource: parts[4],
        toString: function () {
            return parts[1] + "@" + parts[2] + "/" + parts[4];
        },
    };
};
exports.decode64 = function (encoded) {
    return (Buffer.from(encoded, "base64")).toString("utf8");
};
exports.encode64 = function (decoded) {
    return (Buffer.from(decoded, "utf8")).toString("base64");
};
exports.randomstring = function () {
    var l = 5 + Math.floor(Math.random() * 5);
    var chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    var str = "";
    for (var i = 0; i < l; i++) {
        var n = Math.floor(Math.random() * chars.length);
        str += chars.substr(n, 1);
    }
    return str;
};
exports.xmlHttpRequest = function (options, cb, body) {
    var responseCallback = function (response) {
        var xdata = "";
        response.on("data", function (chunk) {
            xdata += chunk.toString();
        });
        response.on("end", function () {
            exports.logIt("DEBUG", "response: " + xdata);
            cb(false, xdata);
        });
        response.on("error", function (ee) {
            cb(true, ee.toString());
        });
    };
    var hr = null;
    if (options.protocol === "https:") {
        hr = https.request(options, responseCallback);
    }
    else {
        hr = http.request(options, responseCallback);
    }
    hr.setHeader("Connection", "Keep-Alive");
    hr.on("error", function (ee) {
        cb(true, ee.toString());
    });
    exports.logIt("DEBUG", "request: " + body);
    if (body) {
        hr.setHeader("Content-Type", "text/xml; charset=utf-8");
        hr.setHeader("Content-Length", body.length.toString());
        hr.write(body);
    }
    hr.end();
};
exports.setLogLevel = function (ss) {
    console.log("New log level: " + ss);
    ss = ss.toUpperCase();
    if (!types_1.BoshJsLogLevel[ss]) {
        console.log("nonexisting log level: " + ss);
        ss = "FATAL";
    }
    LOG_LEVEL = ss;
};
exports.logIt = function (type, quote) {
    if (types_1.BoshJsLogLevel[type]) {
        if (types_1.BoshJsLogLevel[type] <= types_1.BoshJsLogLevel[LOG_LEVEL]) {
            console.log(type + ": " + quote);
        }
    }
};
//# sourceMappingURL=local-utils.js.map