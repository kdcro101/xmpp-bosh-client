"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var http = __importStar(require("http"));
var https = __importStar(require("https"));
var types_1 = require("./types");
var BoshClientBase = (function (_super) {
    __extends(BoshClientBase, _super);
    function BoshClientBase() {
        return _super.call(this) || this;
    }
    BoshClientBase.prototype.jidParse = function (jid) {
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
    BoshClientBase.prototype.decode64 = function (encoded) {
        return (Buffer.from(encoded, "base64")).toString("utf8");
    };
    BoshClientBase.prototype.encode64 = function (decoded) {
        return (Buffer.from(decoded, "utf8")).toString("base64");
    };
    BoshClientBase.prototype.xmlHttpRequest = function (options, callback, body) {
        var _this = this;
        var responseCallback = function (response) {
            var xdata = "";
            response.on("data", function (chunk) {
                xdata += chunk.toString();
            });
            response.on("end", function () {
                _this.log("DEBUG", "response: " + xdata);
                callback(false, xdata);
            });
            response.on("error", function (ee) {
                callback(true, ee.toString());
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
            callback(true, ee.toString());
        });
        this.log("DEBUG", "request: " + body);
        if (body) {
            hr.setHeader("Content-Type", "text/xml; charset=utf-8");
            hr.setHeader("Content-Length", body.length.toString());
            hr.write(body);
        }
        hr.end();
    };
    BoshClientBase.setLogLevel = function (ss) {
        console.log("New log level: " + ss);
        if (!types_1.BoshJsLogLevel[ss]) {
            console.log("nonexisting log level: " + ss);
            ss = "FATAL";
        }
        BoshClientBase.LOG_LEVEL = ss;
    };
    BoshClientBase.prototype.log = function (type, output) {
        if (types_1.BoshJsLogLevel[type]) {
            if (types_1.BoshJsLogLevel[type] <= types_1.BoshJsLogLevel[BoshClientBase.LOG_LEVEL]) {
                console.log(type + ": " + output);
            }
        }
    };
    BoshClientBase.prototype.emit = function (event, data) {
        return _super.prototype.emit.call(this, event, data);
    };
    BoshClientBase.prototype.on = function (event, listener) {
        return _super.prototype.on.call(this, event, listener);
    };
    BoshClientBase.prototype.listeners = function (event) {
        return _super.prototype.listeners.call(this, event);
    };
    BoshClientBase.prototype.unregisterListeners = function () {
        var _this = this;
        this.listeners("online").forEach(function (l) { return _this.removeListener("online", l); });
        this.listeners("offline").forEach(function (l) { return _this.removeListener("offline", l); });
        this.listeners("error").forEach(function (l) { return _this.removeListener("error", l); });
        this.listeners("ping").forEach(function (l) { return _this.removeListener("ping", l); });
    };
    BoshClientBase.prototype.off = function (event, listener) {
        this.removeListener(event, listener);
        return this;
    };
    BoshClientBase.LOG_LEVEL = "FATAL";
    return BoshClientBase;
}(events_1.EventEmitter));
exports.BoshClientBase = BoshClientBase;
//# sourceMappingURL=base.js.map